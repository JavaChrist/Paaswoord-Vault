import { useState } from 'react';
import { User, Key, FileText, ChevronDown, ChevronUp, Globe, CreditCard, X } from 'lucide-react';

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

const accountTypes = [
  {
    id: 'classic',
    name: 'Compte classique',
    description: 'Si c\'est un compte en ligne normal',
    icon: User
  },
  {
    id: 'social',
    name: 'Compte "Se connecter avec"',
    description: 'Si vous avez utilisé la connexion via Google, Facebook, Twitter...',
    icon: Globe
  },
  {
    id: 'unique',
    name: 'Mot de passe unique',
    description: 'Si c\'est un digicode, un code wifi ou tout autre code secret...',
    icon: Key
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Si c\'est une carte bancaire',
    icon: CreditCard
  }
];

export default function AddPasswordModal({ isOpen, onClose, onSave }: AddPasswordModalProps) {
  const [selectedType, setSelectedType] = useState('classic');
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
    notes: ''
  });

  const selectedAccountType = accountTypes.find(type => type.id === selectedType) || accountTypes[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, type: selectedType });
    onClose();
    setFormData({ name: '', identifier: '', password: '', notes: '' });
    setSelectedType('classic');
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setShowTypeSelector(false);
  };

  const handleSave = () => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl shadow-2xl transition-all"
          style={{ backgroundColor: '#2A2A2A' }}
        >
          {/* Header avec nom du compte */}
          <div
            className="px-6 py-4 border-b"
            style={{ backgroundColor: '#2A2A2A', borderColor: '#404040' }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onClose}
                className="flex items-center transition-colors"
                style={{ color: '#F5F5F5' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#F5F5F5'}
              >
                <X size={18} className="mr-1" />
                <span className="text-sm">Annuler</span>
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-1 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: '#F97316', color: '#F5F5F5' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
              >
                Enregistrer
              </button>
            </div>

            {/* Nom du compte dans le header */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
                Nom du compte
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="Choisissez un nom"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#121212',
                    borderColor: '#404040',
                    color: '#F5F5F5'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                  required
                />

                {/* Bouton accordéon */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTypeSelector(!showTypeSelector)}
                    className="p-2 rounded-lg transition-colors relative"
                    style={{ backgroundColor: '#F97316', color: '#F5F5F5' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                  >
                    <selectedAccountType.icon size={20} />
                    {showTypeSelector ? (
                      <ChevronUp size={14} className="absolute -top-1 -right-1" style={{ color: '#F5F5F5' }} />
                    ) : (
                      <ChevronDown size={14} className="absolute -top-1 -right-1" style={{ color: '#F5F5F5' }} />
                    )}
                  </button>

                  {/* Options déroulantes */}
                  {showTypeSelector && (
                    <div
                      className="absolute top-12 right-0 border rounded-lg shadow-2xl min-w-80 z-30 overflow-hidden"
                      style={{ backgroundColor: '#121212', borderColor: '#404040' }}
                    >
                      <div className="p-3 border-b" style={{ borderColor: '#404040' }}>
                        <h4 className="font-medium" style={{ color: '#F5F5F5' }}>
                          Que voulez-vous enregistrer ?
                        </h4>
                      </div>
                      {accountTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleTypeSelect(type.id)}
                          className={`w-full flex items-start gap-3 p-4 text-left transition-colors border-b last:border-b-0`}
                          style={{
                            backgroundColor: selectedType === type.id ? '#F97316' : 'transparent',
                            borderColor: '#404040'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedType !== type.id) {
                              e.currentTarget.style.backgroundColor = '#2A2A2A';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedType !== type.id) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }
                          }}
                        >
                          <type.icon size={20} className="mt-0.5 flex-shrink-0" style={{ color: '#F5F5F5' }} />
                          <div>
                            <div className="font-medium" style={{ color: '#F5F5F5' }}>
                              {type.name}
                            </div>
                            <div className="text-sm mt-1" style={{ color: '#B0B0B0' }}>
                              {type.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire dans la partie noire */}
          <div style={{ backgroundColor: '#121212' }}>
            <form onSubmit={handleSubmit} className="p-6">
              {/* Identifiant */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                  Identifiant
                </label>
                <input
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange('identifier')}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: '#2A2A2A',
                    borderColor: '#404040',
                    color: '#F5F5F5'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: '#2A2A2A',
                      borderColor: '#404040',
                      color: '#F5F5F5'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Key size={18} style={{ color: '#B0B0B0' }} />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                  Notes
                </label>
                <div className="relative">
                  <textarea
                    value={formData.notes}
                    onChange={handleChange('notes')}
                    rows={4}
                    className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none"
                    style={{
                      backgroundColor: '#2A2A2A',
                      borderColor: '#404040',
                      color: '#F5F5F5'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                    placeholder="Informations supplémentaires..."
                  />
                  <div className="absolute right-3 top-3">
                    <FileText size={18} style={{ color: '#B0B0B0' }} />
                  </div>
                </div>
              </div>

              <button type="submit" className="hidden">
                Enregistrer
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer l'accordéon */}
      {showTypeSelector && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowTypeSelector(false)}
        />
      )}
    </div>
  );
} 