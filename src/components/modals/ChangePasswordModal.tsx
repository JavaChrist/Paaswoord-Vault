import { useState } from 'react';
import Modal from '../../components/ui/Modal';
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
      await updatePassword(user, newPassword);
      setSuccess(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier mon mot de passe" onSave={handleSave}>
      <div className="p-6 space-y-4">
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
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ backgroundColor: '#121212', borderColor: '#404040', color: '#F5F5F5' }}
              required
              minLength={6}
            />
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


