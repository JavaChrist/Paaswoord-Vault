import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  

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
      navigate('/vault');
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
                disabled={loading}
                className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#F97316', color: '#F5F5F5' }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#EA580C')}
                onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = '#F97316')}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
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

      
    </div>
  );
} 