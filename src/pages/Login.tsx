import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FaceUnlockButton from '../components/FaceUnlockButton';
import Modal from '../components/ui/Modal';
import { registerPasskey, authenticatePasskey } from '../services/webauthnClient';
import { auth } from '../firebase/firebaseConfig';
import { getWrappedKey, getUnwrapKey, unwrapMasterKey } from '../stores/vaultKeyStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPasskeyPrompt, setShowPasskeyPrompt] = useState(false);
  const [passkeyBusy, setPasskeyBusy] = useState(false);
  const [platformSupported, setPlatformSupported] = useState<boolean>(false);
  const [tryingPasskey, setTryingPasskey] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const supported = await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.();
        setPlatformSupported(Boolean(supported));
      } catch {
        setPlatformSupported(false);
      }
    })();
  }, []);

  // Tentative auto: si Passkey existe et plateforme supportée, essayer FaceID/Windows Hello au démarrage
  useEffect(() => {
    const autoTry = async () => {
      if (!platformSupported) return;
      const storedId = (typeof window !== 'undefined' && localStorage.getItem('passkeyUserId')) || '';
      if (!storedId) return;
      try {
        setTryingPasskey(true);
        await authenticatePasskey(storedId);
        try {
          const record = await getWrappedKey();
          const unwrapKey = await getUnwrapKey();
          if (record && unwrapKey) {
            await unwrapMasterKey(record, unwrapKey);
          }
        } catch (e) {
          console.warn('Déverrouillage masterKey après FaceID non effectué', e);
        }
        navigate('/vault');
      } catch (e) {
        console.warn('FaceID/Windows Hello indisponible, fallback mot de passe', e);
        setTryingPasskey(false);
      }
    };
    autoTry();
  }, [platformSupported, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Afficher la proposition d'activation Passkey une seule fois si supporté
      const alreadyAsked = localStorage.getItem('passkeyPromptShown');
      if (!alreadyAsked && platformSupported) {
        setShowPasskeyPrompt(true);
        localStorage.setItem('passkeyPromptShown', '1');
      } else {
        navigate('/vault');
      }
    } catch (error) {
      setError('Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#121212' }}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 mb-6">
            <img
              src="/icon192.png"
              alt="Password Vault Logo"
              className="w-18 h-18 rounded-xl"
            />
          </div>
          <h2 className="text-3xl font-bold" style={{ color: '#F5F5F5' }}>
            Password Vault
          </h2>
          <p className="mt-2 text-sm" style={{ color: '#B0B0B0' }}>
            Connectez-vous à votre coffre-fort sécurisé
          </p>
        </div>

        <div
          className="rounded-xl shadow-lg p-8"
          style={{ backgroundColor: '#2A2A2A' }}
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div
                className="rounded-lg p-3 text-sm text-center"
                style={{ backgroundColor: '#DC2626', color: '#F5F5F5' }}
              >
                {error}
              </div>
            )}
            {tryingPasskey && (
              <div
                className="rounded-lg p-3 text-sm text-center"
                style={{ backgroundColor: '#1D4ED8', color: '#F5F5F5' }}
              >
                Déverrouillage par FaceID / Windows Hello...
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#121212',
                  borderColor: '#404040',
                  color: '#F5F5F5'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: '#121212',
                  borderColor: '#404040',
                  color: '#F5F5F5'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || tryingPasskey}
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#F97316', color: '#F5F5F5' }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#EA580C')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#F97316')}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>

            {/* Bouton FaceID/Windows Hello */}
            <div>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t" style={{ borderColor: '#404040' }} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2" style={{ color: '#B0B0B0', backgroundColor: '#2A2A2A' }}>
                    ou
                  </span>
                </div>
              </div>
              <FaceUnlockButton
                userId={(typeof window !== 'undefined' && localStorage.getItem('passkeyUserId')) || ''}
                onSuccess={async () => {
                  try {
                    const record = await getWrappedKey();
                    const unwrapKey = await getUnwrapKey();
                    if (record && unwrapKey) {
                      await unwrapMasterKey(record, unwrapKey);
                    } else {
                      console.warn('Aucune wrappedKey ou unwrapKey disponible localement');
                    }
                  } catch (e) {
                    console.error('Échec déverrouillage masterKey après WebAuthn', e);
                  } finally {
                    navigate('/vault');
                  }
                }}
              />
            </div>

            <div className="text-center">
              <p className="text-sm" style={{ color: '#B0B0B0' }}>
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="font-medium transition-colors"
                  style={{ color: '#F97316' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#EA580C'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#F97316'}
                >
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Modale d'activation Passkey */}
      <Modal
        isOpen={showPasskeyPrompt}
        onClose={() => {
          setShowPasskeyPrompt(false);
          navigate('/vault');
        }}
        title="Activer FaceID / Windows Hello ?"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm" style={{ color: '#F5F5F5' }}>
            Déverrouillez votre coffre plus rapidement grâce aux Passkeys via FaceID / Windows Hello. Vous pourrez toujours utiliser votre mot de passe en secours.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#374151', color: '#F5F5F5' }}
              onClick={() => {
                setShowPasskeyPrompt(false);
                navigate('/vault');
              }}
            >
              Plus tard
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: '#F97316', color: '#F5F5F5' }}
              disabled={passkeyBusy}
              onClick={async () => {
                try {
                  setPasskeyBusy(true);
                  const user = auth.currentUser;
                  if (!user || !user.email) throw new Error('Utilisateur non disponible');
                  await registerPasskey(user.uid, user.email);
                } catch (e) {
                  console.error('Activation Passkey échouée', e);
                } finally {
                  setPasskeyBusy(false);
                  setShowPasskeyPrompt(false);
                  navigate('/vault');
                }
              }}
            >
              Activer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
} 