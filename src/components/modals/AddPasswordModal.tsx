import { useState, useEffect } from 'react';
import { User, Key, FileText, ChevronDown, ChevronUp, Globe, CreditCard, X, Trash2, ChevronLeft, Coins, Bitcoin } from 'lucide-react';

interface AddPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  onDelete?: (id: string) => void;
  editMode?: boolean;
  editData?: any;
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
  },
  {
    id: 'crypto',
    name: 'Portefeuille Crypto',
    description: 'Si c\'est un portefeuille de cryptomonnaies',
    icon: Bitcoin
  }
];

// Services disponibles pour "Se connecter avec"
const socialServices = [
  { id: 'apple', name: 'Apple', icon: '🍎' },
  { id: 'windows', name: 'WINDOWS', identifier: 'CG47027L', icon: '🪟' },
  { id: 'facebook', name: 'Facebook', icon: '📘' },
  { id: 'google', name: 'Google', icon: '🔍' },
  { id: 'twitter', name: 'Twitter', icon: '🐦' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'microsoft', name: 'Microsoft', icon: '🪟' },
  { id: 'github', name: 'Github', icon: '🐱' },
  { id: 'slack', name: 'Slack', icon: '💬' }
];

export default function AddPasswordModal({ isOpen, onClose, onSave, onDelete, editMode = false, editData }: AddPasswordModalProps) {
  const [selectedType, setSelectedType] = useState('classic');
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    identifier: '',
    password: '',
    notes: ''
  });

  // État spécialisé pour les cartes bancaires
  const [cardData, setCardData] = useState({
    name: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    bankName: '',
    notes: '',
    pinCode: ''
  });

  // État pour "Se connecter avec"
  const [socialData, setSocialData] = useState({
    name: '',
    selectedServices: [] as string[],
    notes: ''
  });

  // État pour mot de passe unique
  const [uniqueData, setUniqueData] = useState({
    name: '',
    password: '',
    notes: ''
  });

  // État pour portefeuille crypto
  const [cryptoData, setCryptoData] = useState({
    name: '',
    publicKey: '',
    privateKey: '',
    recoveryPhrase: '',
    notes: ''
  });

  // Charger les données en mode édition
  useEffect(() => {
    if (editMode && editData) {
      setSelectedType(editData.type || 'classic');

      if (editData.type === 'card') {
        setCardData({
          name: editData.title || '',
          cardNumber: editData.cardNumber || '',
          expiryDate: editData.expiryDate || '',
          cvv: editData.cvv || '',
          cardholderName: editData.cardholderName || '',
          bankName: editData.bankName || '',
          notes: editData.notes || '',
          pinCode: editData.pinCode || ''
        });
      } else if (editData.type === 'social') {
        setSocialData({
          name: editData.title || '',
          selectedServices: editData.selectedServices || [],
          notes: editData.notes || ''
        });
      } else if (editData.type === 'unique') {
        setUniqueData({
          name: editData.title || '',
          password: editData.password || '',
          notes: editData.notes || ''
        });
      } else if (editData.type === 'crypto') {
        setCryptoData({
          name: editData.title || '',
          publicKey: editData.publicKey || '',
          privateKey: editData.privateKey || '',
          recoveryPhrase: editData.recoveryPhrase || '',
          notes: editData.notes || ''
        });
      } else {
        setFormData({
          name: editData.title || '',
          identifier: editData.identifier || '',
          password: editData.password || '',
          notes: editData.notes || ''
        });
      }
    } else {
      // Reset pour le mode ajout
      setSelectedType('classic');
      setFormData({ name: '', identifier: '', password: '', notes: '' });
      setCardData({ name: '', cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', bankName: '', notes: '', pinCode: '' });
      setSocialData({ name: '', selectedServices: [], notes: '' });
      setUniqueData({ name: '', password: '', notes: '' });
      setCryptoData({ name: '', publicKey: '', privateKey: '', recoveryPhrase: '', notes: '' });
    }
  }, [editMode, editData, isOpen]);

  // Obtenir le type de compte sélectionné
  const selectedAccountType = accountTypes.find(type => type.id === selectedType) || accountTypes[0];

  // Formatage du numéro de carte (ajout d'espaces tous les 4 chiffres)
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Formatage de la date d'expiration (MM/AA)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let dataToSave;

    switch (selectedType) {
      case 'card':
        dataToSave = { ...cardData, type: selectedType, id: editData?.id };
        break;
      case 'social':
        dataToSave = { ...socialData, type: selectedType, id: editData?.id };
        break;
      case 'unique':
        dataToSave = { ...uniqueData, type: selectedType, id: editData?.id };
        break;
      case 'crypto':
        dataToSave = { ...cryptoData, type: selectedType, id: editData?.id };
        break;
      default:
        dataToSave = { ...formData, type: selectedType, id: editData?.id };
    }

    onSave(dataToSave);
    onClose();

    if (!editMode) {
      setFormData({ name: '', identifier: '', password: '', notes: '' });
      setCardData({ name: '', cardNumber: '', expiryDate: '', cvv: '', cardholderName: '', bankName: '', notes: '', pinCode: '' });
      setSocialData({ name: '', selectedServices: [], notes: '' });
      setUniqueData({ name: '', password: '', notes: '' });
      setCryptoData({ name: '', publicKey: '', privateKey: '', recoveryPhrase: '', notes: '' });
      setSelectedType('classic');
    }
  };

  const handleDelete = () => {
    if (editMode && editData?.id && onDelete) {
      const dialog = document.createElement('dialog');
      dialog.style.padding = '0';
      dialog.style.background = 'transparent';
      dialog.innerHTML = `
        <div class="fixed inset-0 z-[1000] flex items-center justify-center">
          <div class="fixed inset-0 bg-black bg-opacity-60"></div>
          <div class="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden" style="background:#2A2A2A;border-color:#F97316">
            <div class="px-6 py-4 border-b" style="border-color:#F97316">
              <h3 class="text-base font-medium" style="color:#F5F5F5">Supprimer l'entrée</h3>
            </div>
            <div class="p-6" style="background:#121212;color:#F5F5F5">
              <p>Êtes-vous sûr de vouloir supprimer cette entrée ?</p>
              <div class="mt-6 flex gap-3 justify-end">
                <button id="cancelBtn" class="px-4 py-2 rounded-lg" style="background:#374151;color:#F5F5F5">Annuler</button>
                <button id="confirmBtn" class="px-4 py-2 rounded-lg" style="background:#DC2626;color:#F5F5F5">Supprimer</button>
              </div>
            </div>
          </div>
        </div>`;
      document.body.appendChild(dialog);
      // @ts-ignore
      dialog.showModal?.();
      const cleanup = () => {
        dialog.close?.();
        dialog.remove();
      };
      dialog.querySelector('#cancelBtn')?.addEventListener('click', () => cleanup());
      dialog.querySelector('#confirmBtn')?.addEventListener('click', () => {
        onDelete(editData.id);
        cleanup();
        onClose();
      });
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCardChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;

    // Formatage spécial selon le champ
    if (field === 'cardNumber') {
      value = formatCardNumber(value);
      if (value.replace(/\s/g, '').length > 16) return; // Limite à 16 chiffres
    } else if (field === 'expiryDate') {
      value = formatExpiryDate(value);
      if (value.length > 5) return; // Format MM/AA
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, ''); // Seulement des chiffres
      if (value.length > 4) return; // Limite à 4 chiffres
    } else if (field === 'pinCode') {
      value = value.replace(/\D/g, ''); // Seulement des chiffres
      if (value.length > 6) return; // Limite à 6 chiffres
    }

    setCardData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSocialData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setSocialData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const handleUniqueChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUniqueData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCryptoChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCryptoData(prev => ({
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

  const getCurrentName = () => {
    switch (selectedType) {
      case 'card': return cardData.name;
      case 'social': return socialData.name;
      case 'unique': return uniqueData.name;
      case 'crypto': return cryptoData.name;
      default: return formData.name;
    }
  };

  const handleNameChange = (value: string) => {
    switch (selectedType) {
      case 'card':
        setCardData(prev => ({ ...prev, name: value }));
        break;
      case 'social':
        setSocialData(prev => ({ ...prev, name: value }));
        break;
      case 'unique':
        setUniqueData(prev => ({ ...prev, name: value }));
        break;
      case 'crypto':
        setCryptoData(prev => ({ ...prev, name: value }));
        break;
      default:
        setFormData(prev => ({ ...prev, name: value }));
    }
  };

  const getPlaceholderText = () => {
    switch (selectedType) {
      case 'card': return 'Ex: Carte Crédit Agricole';
      case 'social': return 'Ex: Connexion réseaux sociaux';
      case 'unique': return 'Ex: Code WiFi';
      case 'crypto': return 'Ex: Mon Wallet Bitcoin';
      default: return 'Choisissez un nom';
    }
  };

  const getHeaderLabel = () => {
    switch (selectedType) {
      case 'card': return 'Nom de la carte';
      case 'social': return 'Nom du compte';
      case 'unique': return 'Nom du mot de passe';
      case 'crypto': return 'Nom du wallet';
      default: return 'Nom du compte';
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

      {/* Overlay pour fermer l'accordéon si ouvert */}
      {!editMode && showTypeSelector && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTypeSelector(false)}
        />
      )}

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative w-full max-w-md transform overflow-hidden rounded-2xl shadow-2xl transition-all"
          style={{ backgroundColor: '#2A2A2A', zIndex: 50, border: '1px solid #F97316' }}
        >
          {/* Header avec nom du compte */}
          <div
            className="px-6 py-4 border-b"
            style={{ backgroundColor: '#2A2A2A', borderColor: '#F97316' }}
          >
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={onClose}
                className="flex items-center transition-colors"
                style={{ color: '#F5F5F5' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#F5F5F5'}
              >
                {editMode ? (
                  <>
                    <ChevronLeft size={18} className="mr-1" />
                    <span className="text-sm">Annuler</span>
                  </>
                ) : (
                  <>
                    <X size={18} className="mr-1" />
                    <span className="text-sm">Annuler</span>
                  </>
                )}
              </button>

              {!editMode && (
                <button
                  onClick={handleSave}
                  className="px-4 py-1 rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#F97316', color: '#F5F5F5' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                >
                  Enregistrer
                </button>
              )}
            </div>

            {/* Nom du compte dans le header */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#F5F5F5' }}>
                {getHeaderLabel()}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={getCurrentName()}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={getPlaceholderText()}
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

                {/* Bouton accordéon - désactivé en mode édition si on ne veut pas changer le type */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (!editMode) {
                        setShowTypeSelector(!showTypeSelector);
                      }
                    }}
                    className="p-2 rounded-lg transition-colors relative"
                    style={{
                      backgroundColor: editMode ? '#666' : '#F97316',
                      color: '#F5F5F5',
                      cursor: editMode ? 'default' : 'pointer'
                    }}
                    onMouseEnter={(e) => !editMode && (e.currentTarget.style.backgroundColor = '#EA580C')}
                    onMouseLeave={(e) => !editMode && (e.currentTarget.style.backgroundColor = '#F97316')}
                    disabled={editMode}
                  >
                    {selectedAccountType && <selectedAccountType.icon size={20} />}
                    {!editMode && (showTypeSelector ? (
                      <ChevronUp size={14} className="absolute -top-1 -right-1" style={{ color: '#F5F5F5' }} />
                    ) : (
                      <ChevronDown size={14} className="absolute -top-1 -right-1" style={{ color: '#F5F5F5' }} />
                    ))}
                  </button>

                  {/* Options déroulantes - seulement en mode ajout */}
                  {!editMode && showTypeSelector && (
                    <div
                      className="absolute top-12 right-0 border rounded-lg shadow-2xl min-w-80 overflow-hidden"
                      style={{ backgroundColor: '#121212', borderColor: '#404040', zIndex: 60 }}
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
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTypeSelect(type.id);
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTypeSelect(type.id);
                          }}
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
              {/* Formulaire selon le type sélectionné */}
              {selectedType === 'card' ? (
                // Formulaire pour cartes bancaires
                <>
                  {/* Code PIN */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Code PIN
                    </label>
                    <input
                      type={editMode ? "text" : "password"}
                      value={cardData.pinCode}
                      onChange={handleCardChange('pinCode')}
                      placeholder="1234"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-mono"
                      style={{
                        backgroundColor: '#2A2A2A',
                        borderColor: '#404040',
                        color: '#F5F5F5'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                    />
                  </div>

                  {/* Numéro de carte */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      value={cardData.cardNumber}
                      onChange={handleCardChange('cardNumber')}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-mono tracking-wider"
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

                  {/* Date d'expiration et CVV */}
                  <div className="mb-6 flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                        Date d'expiration
                      </label>
                      <input
                        type="text"
                        value={cardData.expiryDate}
                        onChange={handleCardChange('expiryDate')}
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-mono"
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
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={handleCardChange('cvv')}
                        placeholder="123"
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 font-mono"
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
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                    <div className="relative">
                      <textarea
                        value={cardData.notes}
                        onChange={handleCardChange('notes')}
                        rows={3}
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
                </>
              ) : selectedType === 'social' ? (
                // Formulaire pour "Se connecter avec"
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Je me suis connecté via
                    </label>
                    <div className="space-y-3">
                      {socialServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-3 border rounded-lg transition-colors"
                          style={{
                            backgroundColor: '#2A2A2A',
                            borderColor: '#404040'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{service.icon}</span>
                            <div>
                              <div className="font-medium" style={{ color: '#F5F5F5' }}>
                                {service.name}
                              </div>
                              {service.identifier && (
                                <div className="text-sm" style={{ color: '#B0B0B0' }}>
                                  {service.identifier}
                                </div>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleServiceToggle(service.id)}
                            className="w-6 h-6 border-2 rounded transition-colors"
                            style={{
                              backgroundColor: socialData.selectedServices.includes(service.id) ? '#F97316' : 'transparent',
                              borderColor: socialData.selectedServices.includes(service.id) ? '#F97316' : '#404040'
                            }}
                          >
                            {socialData.selectedServices.includes(service.id) && (
                              <span className="block w-full h-full text-center text-xs leading-4" style={{ color: '#121212' }}>
                                ✓
                              </span>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                    <textarea
                      value={socialData.notes}
                      onChange={handleSocialChange('notes')}
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
                  </div>
                </>
              ) : selectedType === 'unique' ? (
                // Formulaire pour mot de passe unique
                <>
                  {/* Mot de passe */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Mot de passe
                    </label>
                    <input
                      type={editMode ? "text" : "password"}
                      value={uniqueData.password}
                      onChange={handleUniqueChange('password')}
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

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                    <textarea
                      value={uniqueData.notes}
                      onChange={handleUniqueChange('notes')}
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
                  </div>
                </>
              ) : selectedType === 'crypto' ? (
                // Formulaire pour portefeuille crypto
                <>
                  {/* Clé publique */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Clé publique
                    </label>
                    <textarea
                      value={cryptoData.publicKey}
                      onChange={handleCryptoChange('publicKey')}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none font-mono text-xs"
                      style={{
                        backgroundColor: '#2A2A2A',
                        borderColor: '#404040',
                        color: '#F5F5F5'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                      placeholder="Votre clé publique..."
                    />
                  </div>

                  {/* Clé privée */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Clé privée
                    </label>
                    <textarea
                      value={cryptoData.privateKey}
                      onChange={handleCryptoChange('privateKey')}
                      rows={3}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none font-mono text-xs"
                      style={{
                        backgroundColor: '#2A2A2A',
                        borderColor: '#404040',
                        color: '#F5F5F5'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                      placeholder="Votre clé privée..."
                    />
                  </div>

                  {/* Phrase de récupération */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Phrase de récupération
                    </label>
                    <textarea
                      value={cryptoData.recoveryPhrase}
                      onChange={handleCryptoChange('recoveryPhrase')}
                      rows={4}
                      className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none"
                      style={{
                        backgroundColor: '#2A2A2A',
                        borderColor: '#404040',
                        color: '#F5F5F5'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#404040'}
                      placeholder="Vos mots de récupération (seed phrase)..."
                    />
                  </div>

                  {/* Notes */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                    <textarea
                      value={cryptoData.notes}
                      onChange={handleCryptoChange('notes')}
                      rows={3}
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
                  </div>
                </>
              ) : (
                // Formulaire classique pour autres types
                <>
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
                        type={editMode ? "text" : "password"}
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
                </>
              )}

              {/* Boutons d'action en bas en mode édition */}
              {editMode && (
                <div className="mt-8 space-y-3">
                  {/* Bouton supprimer */}
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: '#DC2626', color: '#F5F5F5' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                  >
                    Supprimer
                  </button>

                  {/* Bouton enregistrer */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: '#F97316', color: '#F5F5F5' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                  >
                    Enregistrer
                  </button>
                </div>
              )}

              <button type="submit" className="hidden">
                {editMode ? 'Modifier' : 'Enregistrer'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay pour fermer l'accordéon */}
      {!editMode && showTypeSelector && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowTypeSelector(false)}
        />
      )}
    </div>
  );
} 