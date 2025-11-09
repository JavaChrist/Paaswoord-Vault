import { useState } from 'react';
import { X, Eye, EyeOff, Copy, Edit3 } from 'lucide-react';

interface ViewPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onCopy: (field: string, value: string) => void;
  entry: any;
}

export default function ViewPasswordModal({ isOpen, onClose, onEdit, onCopy, entry }: ViewPasswordModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showCardNumber, setShowCardNumber] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const [showPinCode, setShowPinCode] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);

  if (!isOpen || !entry) return null;

  const isCard = entry.type === 'card';
  const isSocial = entry.type === 'social';
  const isUnique = entry.type === 'unique';
  const isCrypto = entry.type === 'crypto';
  const isClassic = !entry.type || entry.type === 'classic';

  const maskCardNumber = (cardNumber: string) => {
    if (!cardNumber) return '';
    const clean = cardNumber.replace(/\s/g, '');
    return `•••• •••• •••• ${clean.slice(-4)}`;
  };

  const formatCardNumber = (cardNumber: string) => {
    if (!cardNumber) return '';
    const clean = cardNumber.replace(/\s/g, '');
    return clean.replace(/(.{4})/g, '$1 ').trim();
  };

  const handleCopy = (field: string, value: string) => {
    if (value) {
      onCopy(field, value);
    }
  };

  const getMainCopyValue = () => {
    switch (entry.type) {
      case 'card':
        return entry.cardNumber?.replace(/\s/g, '') || '';
      case 'unique':
        return entry.password || '';
      case 'crypto':
        return entry.privateKey || entry.publicKey || '';
      default:
        return entry.password || '';
    }
  };

  const getMainCopyLabel = () => {
    switch (entry.type) {
      case 'card':
        return 'Copier le numéro';
      case 'unique':
        return 'Copier le mot de passe';
      case 'crypto':
        return 'Copier la clé privée';
      default:
        return 'Copier le mot de passe';
    }
  };

  const getEditLabel = () => {
    switch (entry.type) {
      case 'card':
        return 'Modifier cette carte';
      case 'social':
        return 'Modifier ces connexions';
      case 'unique':
        return 'Modifier ce mot de passe';
      case 'crypto':
        return 'Modifier ce wallet';
      default:
        return 'Modifier ce compte';
    }
  };

  // Services sociaux pour l'affichage
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
          style={{ backgroundColor: '#2A2A2A', border: '1px solid #F97316' }}
        >
          {/* Header avec nom de l'entrée */}
          <div
            className="px-6 py-4 border-b relative"
            style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: '#F5F5F5' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.2)'}
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold pr-12" style={{ color: '#121212' }}>
              {entry.title}
            </h2>

            {isCard && entry.bankName && (
              <p className="text-sm mt-1 opacity-80" style={{ color: '#121212' }}>
                {entry.bankName}
              </p>
            )}
          </div>

          {/* Contenu de la modal */}
          <div style={{ backgroundColor: '#121212' }} className="p-6">
            {isCard ? (
              // Vue pour cartes bancaires
              <>
                {/* Code PIN */}
                {entry.pinCode && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Code PIN
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 pr-20 border rounded-lg font-mono"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5'
                        }}
                      >
                        {showPinCode ? entry.pinCode : '••••'}
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <button
                          onClick={() => handleCopy('pinCode', entry.pinCode)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                          title="Copier le PIN"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setShowPinCode(!showPinCode)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                        >
                          {showPinCode ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Numéro de carte */}
                {entry.cardNumber && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Numéro de carte
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 pr-20 border rounded-lg font-mono tracking-wider text-lg"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5'
                        }}
                      >
                        {showCardNumber ? formatCardNumber(entry.cardNumber) : maskCardNumber(entry.cardNumber)}
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <button
                          onClick={() => handleCopy('cardNumber', entry.cardNumber?.replace(/\s/g, ''))}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                          title="Copier le numéro"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setShowCardNumber(!showCardNumber)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                        >
                          {showCardNumber ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Date d'expiration et CVV */}
                {(entry.expiryDate || entry.cvv) && (
                  <div className="mb-6 flex gap-4">
                    {entry.expiryDate && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                          Expiration
                        </label>
                        <div className="relative">
                          <div
                            className="w-full px-4 py-3 pr-12 border rounded-lg font-mono"
                            style={{
                              backgroundColor: '#2A2A2A',
                              borderColor: '#404040',
                              color: '#F5F5F5'
                            }}
                          >
                            {entry.expiryDate}
                          </div>
                          <button
                            onClick={() => handleCopy('expiryDate', entry.expiryDate)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors"
                            style={{ color: '#B0B0B0' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                            title="Copier la date"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    {entry.cvv && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                          CVV
                        </label>
                        <div className="relative">
                          <div
                            className="w-full px-4 py-3 pr-20 border rounded-lg font-mono"
                            style={{
                              backgroundColor: '#2A2A2A',
                              borderColor: '#404040',
                              color: '#F5F5F5'
                            }}
                          >
                            {showCvv ? entry.cvv : '•••'}
                          </div>
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                            <button
                              onClick={() => handleCopy('cvv', entry.cvv)}
                              className="p-1 rounded transition-colors"
                              style={{ color: '#B0B0B0' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                              title="Copier le CVV"
                            >
                              <Copy size={14} />
                            </button>
                            <button
                              onClick={() => setShowCvv(!showCvv)}
                              className="p-1 rounded transition-colors"
                              style={{ color: '#B0B0B0' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                            >
                              {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Nom du porteur */}
                {entry.cardholderName && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Nom du porteur
                    </label>
                    <div
                      className="w-full px-4 py-3 border rounded-lg uppercase"
                      style={{
                        backgroundColor: '#2A2A2A',
                        borderColor: '#404040',
                        color: '#F5F5F5'
                      }}
                    >
                      {entry.cardholderName}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                      <div
                        className="w-full px-4 py-3 border rounded-lg"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5',
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto'
                        }}
                      >
                      {entry.notes}
                    </div>
                  </div>
                )}
              </>
            ) : isSocial ? (
              // Vue pour connexions sociales
              <>
                {entry.selectedServices && entry.selectedServices.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Connecté via
                    </label>
                    <div className="space-y-3">
                      {entry.selectedServices.map((serviceId: string) => {
                        const service = socialServices.find(s => s.id === serviceId);
                        if (!service) return null;
                        return (
                          <div
                            key={serviceId}
                            className="flex items-center gap-3 p-3 border rounded-lg"
                            style={{
                              backgroundColor: '#2A2A2A',
                              borderColor: '#404040'
                            }}
                          >
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
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                      <div
                        className="w-full px-4 py-3 border rounded-lg"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5',
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto'
                        }}
                      >
                      {entry.notes}
                    </div>
                  </div>
                )}
              </>
            ) : isUnique ? (
              // Vue pour mot de passe unique
              <>
                {/* Mot de passe */}
                {entry.password && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Mot de passe
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 pr-20 border rounded-lg font-mono"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5'
                        }}
                      >
                        {showPassword ? entry.password : '•'.repeat(16)}
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <button
                          onClick={() => handleCopy('password', entry.password)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                          title="Copier le mot de passe"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                      <div
                        className="w-full px-4 py-3 border rounded-lg"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5',
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto'
                        }}
                      >
                      {entry.notes}
                    </div>
                  </div>
                )}
              </>
            ) : isCrypto ? (
              // Vue pour portefeuille crypto
              <>
                {/* Clé publique */}
                {entry.publicKey && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Clé publique
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 pr-12 border rounded-lg font-mono text-xs break-all"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5'
                        }}
                      >
                        {entry.publicKey}
                      </div>
                      <button
                        onClick={() => handleCopy('publicKey', entry.publicKey)}
                        className="absolute right-2 top-3 p-1 rounded transition-colors"
                        style={{ color: '#B0B0B0' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                        title="Copier la clé publique"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Clé privée */}
                {entry.privateKey && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Clé privée
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 pr-20 border rounded-lg font-mono text-xs break-all"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5'
                        }}
                      >
                        {showPrivateKey ? entry.privateKey : '•'.repeat(64)}
                      </div>
                      <div className="absolute right-2 top-3 flex gap-1">
                        <button
                          onClick={() => handleCopy('privateKey', entry.privateKey)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                          title="Copier la clé privée"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                        >
                          {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Phrase de récupération */}
                {entry.recoveryPhrase && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Phrase de récupération
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 pr-20 border rounded-lg"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5'
                        }}
                      >
                        {showRecoveryPhrase ? entry.recoveryPhrase : '•'.repeat(64)}
                      </div>
                      <div className="absolute right-2 top-3 flex gap-1">
                        <button
                          onClick={() => handleCopy('recoveryPhrase', entry.recoveryPhrase)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                          title="Copier la phrase de récupération"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setShowRecoveryPhrase(!showRecoveryPhrase)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                        >
                          {showRecoveryPhrase ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                      <div
                        className="w-full px-4 py-3 border rounded-lg"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5',
                          wordBreak: 'break-all',
                          overflowWrap: 'anywhere',
                          whiteSpace: 'pre-wrap',
                          overflowX: 'auto'
                        }}
                      >
                      {entry.notes}
                    </div>
                  </div>
                )}
              </>
            ) : (
              // Vue pour comptes classiques
              <>
                {/* Identifiant */}
                {entry.identifier && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Identifiant
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 pr-12 border rounded-lg"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5'
                        }}
                      >
                        {entry.identifier}
                      </div>
                      <button
                        onClick={() => handleCopy('identifier', entry.identifier)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors"
                        style={{ color: '#B0B0B0' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                        title="Copier l'identifiant"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Mot de passe */}
                {entry.password && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Mot de passe
                    </label>
                    <div className="relative">
                      <div
                        className="w-full px-4 py-3 pr-20 border rounded-lg font-mono"
                        style={{
                          backgroundColor: '#2A2A2A',
                          borderColor: '#404040',
                          color: '#F5F5F5'
                        }}
                      >
                        {showPassword ? entry.password : '•'.repeat(16)}
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                        <button
                          onClick={() => handleCopy('password', entry.password)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                          title="Copier le mot de passe"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="p-1 rounded transition-colors"
                          style={{ color: '#B0B0B0' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#F97316'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#B0B0B0'}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {entry.notes && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3" style={{ color: '#F5F5F5' }}>
                      Notes
                    </label>
                    <div
                      className="w-full px-4 py-3 border rounded-lg"
                      style={{
                        backgroundColor: '#2A2A2A',
                        borderColor: '#404040',
                        color: '#F5F5F5',
                        wordBreak: 'break-all',
                        overflowWrap: 'anywhere',
                        whiteSpace: 'pre-wrap',
                        overflowX: 'auto'
                      }}
                    >
                      {entry.notes}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Bouton d'action en bas */}
            <div className="mt-8">
              <button
                onClick={onEdit}
                className="w-full flex flex-col items-center justify-center py-4 rounded-xl transition-colors"
                style={{ backgroundColor: '#F97316', color: '#121212' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
              >
                <Edit3 size={20} className="mb-2" />
                <span className="text-sm">{getEditLabel()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 