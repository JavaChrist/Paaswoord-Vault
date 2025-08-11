import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Props { onClose: () => void }

export default function AutoLogoutSelector({ onClose }: Props) {
  const { autoLogoutMinutes, setAutoLogoutMinutes } = useAuth();
  const [value, setValue] = useState<number>(autoLogoutMinutes);

  const options = [0, 1, 5, 15, 30];

  const save = () => {
    setAutoLogoutMinutes(value);
    onClose();
  };

  return (
    <div>
      <p className="text-sm mb-4" style={{ color: '#B0B0B0' }}>
        Choisissez un délai d'inactivité avant déconnexion automatique.
      </p>
      <div className="grid grid-cols-4 gap-3">
        {options.map((m) => (
          <button
            key={m}
            onClick={() => setValue(m)}
            className="py-2 rounded-lg border transition-colors"
            style={{
              backgroundColor: value === m ? '#F97316' : '#2A2A2A',
              borderColor: '#F97316',
              color: value === m ? '#121212' : '#F5F5F5'
            }}
          >
            {m === 0 ? 'Jamais' : `${m} min`}
          </button>
        ))}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onClose} className="px-4 py-2 rounded-lg" style={{ background: '#374151', color: '#F5F5F5' }}>Annuler</button>
        <button onClick={save} className="px-4 py-2 rounded-lg" style={{ background: '#F97316', color: '#121212' }}>Enregistrer</button>
      </div>
    </div>
  );
}


