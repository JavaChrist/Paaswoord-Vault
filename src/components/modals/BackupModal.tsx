import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, deleteDoc, doc, writeBatch, setDoc } from 'firebase/firestore';
import { encryptJSON, decryptJSON, EncryptedPayload } from '../../utils/crypto';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BackupModal({ isOpen, onClose }: BackupModalProps) {
  const { currentUser } = useAuth();
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'export' | 'import'>('export');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [confirmReplace, setConfirmReplace] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPassphrase('');
      setConfirmPassphrase('');
      setFile(null);
      setError(null);
      setSuccess(null);
      setMode('export');
    }
  }, [isOpen]);

  const handleExport = async () => {
    setError(null); setSuccess(null);
    if (!currentUser) { setError('Non connecté'); return; }
    if (!passphrase || passphrase.length < 6) { setError('Passphrase trop courte'); return; }
    setBusy(true);
    try {
      const q = query(collection(db, 'passwords'), where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const payload = { userId: currentUser.uid, items };
      const encrypted = await encryptJSON(payload, passphrase);
      const blob = new Blob([JSON.stringify(encrypted, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `keybox-backup-${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      setSuccess('Export terminé');
    } catch (e:any) {
      setError('Échec export');
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const handleImport = async () => {
    setError(null); setSuccess(null);
    if (!currentUser) { setError('Non connecté'); return; }
    if (!file) { setError('Aucun fichier'); return; }
    if (!passphrase) { setError('Entrez la passphrase'); return; }
    if (restoreMode === 'replace' && !confirmReplace) { setError('Veuillez confirmer le remplacement complet'); return; }
    setBusy(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text) as EncryptedPayload;
      const data = await decryptJSON<any>(json, passphrase);
      if (data.userId !== currentUser.uid) {
        setError('Sauvegarde d\'un autre utilisateur');
        setBusy(false);
        return;
      }
      const items: any[] = Array.isArray(data.items) ? data.items : [];
      const userQ = query(collection(db, 'passwords'), where('userId', '==', currentUser.uid));
      const existingSnap = await getDocs(userQ);
      const batch = writeBatch(db);

      if (restoreMode === 'replace') {
        existingSnap.forEach((d) => batch.delete(d.ref));
      }

      for (const it of items) {
        const { id, createdAt, updatedAt, ...rest } = it || {};
        if (!id || typeof id !== 'string') continue;
        const ref = doc(db, 'passwords', id);
        batch.set(ref, { ...rest, userId: currentUser.uid });
      }

      await batch.commit();
      setSuccess(`Import terminé: ${items.length} élément(s) restauré(s)`);
    } catch (e:any) {
      console.error(e);
      setError('Échec import (passphrase ou format invalide)');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export / Import chiffré" onSave={mode === 'export' ? handleExport : handleImport} disableSave={busy || (mode==='export' ? passphrase.length < 6 : !passphrase || (mode==='import' && !file) || (restoreMode==='replace' && !confirmReplace))}>
      <div className="p-6 space-y-4" style={{ backgroundColor: '#121212' }}>
        <div className="flex gap-2">
          <button onClick={() => setMode('export')} className="px-4 py-2 rounded-lg border" style={{ backgroundColor: mode==='export' ? '#F97316' : '#2A2A2A', borderColor: '#F97316', color: mode==='export' ? '#121212' : '#F5F5F5' }}>Exporter</button>
          <button onClick={() => setMode('import')} className="px-4 py-2 rounded-lg border" style={{ backgroundColor: mode==='import' ? '#F97316' : '#2A2A2A', borderColor: '#F97316', color: mode==='import' ? '#121212' : '#F5F5F5' }}>Importer</button>
        </div>

        {error && <div className="rounded-lg p-3 text-sm" style={{ backgroundColor: '#7F1D1D', color: '#F5F5F5' }}>{error}</div>}
        {success && <div className="rounded-lg p-3 text-sm" style={{ backgroundColor: '#14532D', color: '#F5F5F5' }}>{success}</div>}

        {mode === 'export' ? (
          <>
            <p className="text-sm" style={{ color: '#B0B0B0' }}>Saisissez une passphrase pour chiffrer la sauvegarde (AES‑256‑GCM, PBKDF2).</p>
            <label className="block text-sm mb-2" style={{ color: '#F5F5F5' }}>Passphrase</label>
            <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} className="w-full px-3 py-2 border rounded-lg" style={{ backgroundColor: '#121212', borderColor: '#404040', color: '#F5F5F5' }} />
            <p className="text-xs" style={{ color: '#B0B0B0' }}>Recommandé: 12+ caractères, lettres/chiffres/symboles.</p>
          </>
        ) : (
          <>
            <p className="text-sm" style={{ color: '#B0B0B0' }}>Sélectionnez un fichier de sauvegarde KeyBox et entrez la passphrase.</p>
            <label className="block text-sm mb-2" style={{ color: '#F5F5F5' }}>Fichier</label>
            <input type="file" accept="application/json" onChange={(e)=> setFile(e.target.files?.[0] || null)} className="w-full text-sm" />
            <label className="block text-sm mb-2 mt-4" style={{ color: '#F5F5F5' }}>Passphrase</label>
            <input type="password" value={passphrase} onChange={(e) => setPassphrase(e.target.value)} className="w-full px-3 py-2 border rounded-lg" style={{ backgroundColor: '#121212', borderColor: '#404040', color: '#F5F5F5' }} />

            <div className="mt-4 space-y-2">
              <label className="block text-sm" style={{ color: '#F5F5F5' }}>Mode de restauration</label>
              <div className="flex items-center gap-4 text-sm" style={{ color: '#F5F5F5' }}>
                <label className="flex items-center gap-2">
                  <input type="radio" name="restore" checked={restoreMode==='merge'} onChange={()=>setRestoreMode('merge')} />
                  Fusionner/Ajouter
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="restore" checked={restoreMode==='replace'} onChange={()=>setRestoreMode('replace')} />
                  Remplacer tout
                </label>
              </div>
              {restoreMode==='replace' && (
                <label className="flex items-center gap-2 text-xs" style={{ color: '#F5F5F5' }}>
                  <input type="checkbox" checked={confirmReplace} onChange={(e)=> setConfirmReplace(e.target.checked)} />
                  Je comprends que toutes les entrées existantes seront supprimées avant import.
                </label>
              )}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}


