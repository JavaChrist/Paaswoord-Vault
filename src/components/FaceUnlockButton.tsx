import { useEffect, useMemo, useState } from 'react';
import { authenticatePasskey } from '../services/webauthnClient';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface Props {
  userId: string;
  onSuccess: () => void;
  className?: string;
}

export default function FaceUnlockButton({ userId, onSuccess, className }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        // Détection du support d'un authentificateur plateforme (Windows Hello / Face ID)
        const supported = await window.PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable?.();
        setIsSupported(Boolean(supported));
      } catch (e) {
        console.warn('[WebAuthn] Détection support a échoué', e);
        setIsSupported(false);
      }
    })();
  }, []);

  const label = useMemo(() => {
    switch (status) {
      case 'loading':
        return 'Déverrouillage...';
      case 'success':
        return 'Déverrouillé';
      case 'error':
        return 'Réessayer FaceID/Windows Hello';
      default:
        return 'Déverrouiller avec FaceID/Windows Hello';
    }
  }, [status]);

  const onClick = async () => {
    setError(null);
    setStatus('loading');
    try {
      await authenticatePasskey(userId);
      setStatus('success');
      onSuccess();
    } catch (e: any) {
      console.error('[WebAuthn] Échec auth', e);
      setError(e?.message || 'Échec de l\'authentification');
      setStatus('error');
    }
  };

  const disabled = !isSupported || !userId || status === 'loading';

  return (
    <div className={className}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="w-full py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
        style={{ backgroundColor: '#2563EB', color: '#F5F5F5' }}
        onMouseEnter={(e) => !(status === 'loading') && (e.currentTarget.style.backgroundColor = '#1D4ED8')}
        onMouseLeave={(e) => !(status === 'loading') && (e.currentTarget.style.backgroundColor = '#2563EB')}
      >
        {label}
      </button>
      {!isSupported && (
        <p className="mt-2 text-xs" style={{ color: '#B0B0B0' }}>
          Cet appareil ne supporte pas l'authentificateur plateforme.
        </p>
      )}
      {(!userId) && (
        <p className="mt-2 text-xs" style={{ color: '#B0B0B0' }}>
          Aucun Passkey enregistré pour cet appareil/utilisateur.
        </p>
      )}
      {error && (
        <p className="mt-2 text-xs" style={{ color: '#DC2626' }}>
          {error}
        </p>
      )}
    </div>
  );
}


