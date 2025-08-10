import { useState } from 'react';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../contexts/ToastContext';
import { auth } from '../../firebase/firebaseConfig';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChanged?: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose, onChanged }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [strength, setStrength] = useState<'weak' | 'medium' | 'strong' | 'empty'>('empty');
  const { showToast } = useToast();

  const evaluateStrength = (value: string) => {
    if (!value) return 'empty' as const;
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasDigit = /[0-9]/.test(value);
    const longEnough = value.length >= 8;
    const good = [hasUpper, hasLower, hasDigit, longEnough].filter(Boolean).length;
    if (good >= 4) return 'strong' as const;
    if (good >= 2) return 'medium' as const;
    return 'weak' as const;
  };

  const canSave = !loading && !success && strength !== 'weak' && strength !== 'empty' && !!currentPassword && !!newPassword && newPassword === confirmPassword;

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("Utilisateur introuvable");
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      // Validation stricte côté client
      const hasUpper = /[A-Z]/.test(newPassword);
      const hasDigit = /[0-9]/.test(newPassword);
      if (!(newPassword.length >= 8 && hasUpper && hasDigit)) {
        setError('Le mot de passe doit faire 8+ caractères avec au moins une majuscule et un chiffre');
        setLoading(false);
        return;
      }
      await updatePassword(user, newPassword);
      setSuccess(true);
      showToast('Mot de passe modifié avec succès', 'success');
      if (onChanged) onChanged();
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (e: any) {
      const msg = e?.code === 'auth/wrong-password'
        ? 'Mot de passe actuel incorrect'
        : e?.code === 'auth/weak-password'
          ? 'Mot de passe trop faible'
          : 'Impossible de modifier le mot de passe';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier mon mot de passe" onSave={handleSave} disableSave={!canSave}>
      <div className="p-6 space-y-4" style={{ backgroundColor: '#121212' }}>
        {error && (
          <div className="rounded-lg p-3 text-sm text-center" style={{ backgroundColor: '#DC2626', color: '#F5F5F5' }}>
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg p-3 text-sm text-center" style={{ backgroundColor: '#16A34A', color: '#F5F5F5' }}>
            Mot de passe modifié
          </div>
        )}

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#121212', borderColor: '#404040', color: '#F5F5F5' }}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setStrength(evaluateStrength(e.target.value)); }}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#121212', borderColor: '#404040', color: '#F5F5F5' }}
              required
              minLength={6}
            />
            {/* Indicateur visuel de robustesse */}
            <div className="mt-2">
              <div className="h-2 w-full rounded bg-gray-700 overflow-hidden">
                <div
                  className="h-2"
                  style={{
                    width: strength === 'empty' ? '0%' : strength === 'weak' ? '33%' : strength === 'medium' ? '66%' : '100%',
                    backgroundColor: strength === 'strong' ? '#16A34A' : strength === 'medium' ? '#F59E0B' : '#DC2626'
                  }}
                />
              </div>
              <p className="mt-2 text-xs" style={{ color: '#B0B0B0' }}>
                {strength === 'strong' ? 'Robustesse: élevée' : strength === 'medium' ? 'Robustesse: moyenne' : strength === 'weak' ? 'Robustesse: faible' : 'Entrez un mot de passe'}
              </p>
              <p className="text-xs" style={{ color: '#B0B0B0' }}>
                Requis: 8+ caractères, au moins 1 majuscule et 1 chiffre.
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#121212', borderColor: '#404040', color: '#F5F5F5' }}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="hidden" disabled={loading}>Enregistrer</button>
        </form>
      </div>
    </Modal>
  );
}


