import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Settings, Plus, Copy, LogOut, KeyRound } from 'lucide-react';
import AddPasswordModal from '../components/modals/AddPasswordModal';
import ViewPasswordModal from '../components/modals/ViewPasswordModal';
import CopyNotification from '../components/CopyNotification';
import ChangePasswordModal from '../components/modals/ChangePasswordModal';
import {
  getUserPasswords,
  addPassword,
  updatePassword,
  deletePassword,
  generateSection,
  generateDisplayIdentifier,
  PasswordEntry
} from '../services/passwordService';

// Interface importée depuis passwordService

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PasswordEntry | null>(null);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [copiedEntryName, setCopiedEntryName] = useState('');
  const [passwordEntries, setPasswordEntries] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  

  // Charger les mots de passe depuis Firebase
  useEffect(() => {
    const loadPasswords = async () => {
      if (!currentUser) return;

      try {
        setIsLoading(true);
        setError(null);
        const passwords = await getUserPasswords(currentUser.uid);
        setPasswordEntries(passwords);
      } catch (err) {
        console.error('Erreur lors du chargement des mots de passe:', err);
        setError('Impossible de charger les mots de passe');
      } finally {
        setIsLoading(false);
      }
    };

    loadPasswords();
  }, [currentUser]);

  



  const handleCopyPassword = async (title: string) => {
    const entry = passwordEntries.find(e => e.title === title);
    if (!entry) return;

    try {
      if (entry.type === 'card') {
        // Pour les cartes: copier le numéro complet (sans espaces)
        const cardNumber = entry.cardNumber?.replace(/\s/g, '') || '';
        await navigator.clipboard.writeText(cardNumber);
        setCopiedEntryName(title);
        setShowCopyNotification(true);
      } else {
        // Pour les autres types: copier le mot de passe
        await navigator.clipboard.writeText(entry.password || '');
        setCopiedEntryName(title);
        setShowCopyNotification(true);
      }
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      // Fallback pour les navigateurs qui ne supportent pas l'API clipboard
      console.log(`Impossible de copier automatiquement pour: ${title}`);
    }
  };

  const handleCopyFromModal = async (field: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      console.log(`${field} copié dans le presse-papiers`);
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      console.log(`Impossible de copier ${field} automatiquement`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
    setShowSettings(false);
  };

  const handleAddPassword = async (data: any) => {
    if (!currentUser) return;

    try {
      const section = generateSection(data.name);
      let passwordData: Omit<PasswordEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        title: data.name,
        section,
        type: data.type,
        identifier: '',
        notes: data.notes || ''
      };

      // Adapter les données selon le type
      switch (data.type) {
        case 'card':
          passwordData = {
            ...passwordData,
            identifier: generateDisplayIdentifier({ ...passwordData, cardNumber: data.cardNumber } as PasswordEntry),
            cardNumber: data.cardNumber,
            expiryDate: data.expiryDate,
            cvv: data.cvv,
            cardholderName: data.cardholderName,
            bankName: data.bankName,
            pinCode: data.pinCode
          };
          break;

        case 'social':
          passwordData = {
            ...passwordData,
            identifier: generateDisplayIdentifier({ ...passwordData, selectedServices: data.selectedServices } as PasswordEntry),
            selectedServices: data.selectedServices
          };
          break;

        case 'unique':
          passwordData = {
            ...passwordData,
            identifier: 'Mot de passe unique',
            password: data.password
          };
          break;

        case 'crypto':
          passwordData = {
            ...passwordData,
            identifier: 'Portefeuille crypto',
            publicKey: data.publicKey,
            privateKey: data.privateKey,
            recoveryPhrase: data.recoveryPhrase
          };
          break;

        default: // classic
          passwordData = {
            ...passwordData,
            identifier: data.identifier,
            password: data.password
          };
          break;
      }

      // Ajouter à Firebase
      const newId = await addPassword(currentUser.uid, passwordData);

      // Mettre à jour l'état local
      const newEntry: PasswordEntry = {
        ...passwordData,
        id: newId,
        userId: currentUser.uid
      };

      setPasswordEntries(prev => [...prev, newEntry]);
      console.log('Nouvelle entrée ajoutée:', newEntry);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du mot de passe:', error);
      setError('Impossible d\'ajouter le mot de passe');
    }
  };

  const handleEditPassword = async (data: any) => {
    if (!currentUser || !data.id) return;

    try {
      const section = generateSection(data.name);
      let updateData: Partial<PasswordEntry> = {
        title: data.name,
        section,
        type: data.type,
        notes: data.notes || ''
      };

      // Adapter les données selon le type
      switch (data.type) {
        case 'card':
          updateData = {
            ...updateData,
            identifier: generateDisplayIdentifier({ ...updateData, cardNumber: data.cardNumber } as PasswordEntry),
            cardNumber: data.cardNumber,
            expiryDate: data.expiryDate,
            cvv: data.cvv,
            cardholderName: data.cardholderName,
            bankName: data.bankName,
            pinCode: data.pinCode
          };
          break;

        case 'social':
          updateData = {
            ...updateData,
            identifier: generateDisplayIdentifier({ ...updateData, selectedServices: data.selectedServices } as PasswordEntry),
            selectedServices: data.selectedServices
          };
          break;

        case 'unique':
          updateData = {
            ...updateData,
            identifier: 'Mot de passe unique',
            password: data.password
          };
          break;

        case 'crypto':
          updateData = {
            ...updateData,
            identifier: 'Portefeuille crypto',
            publicKey: data.publicKey,
            privateKey: data.privateKey,
            recoveryPhrase: data.recoveryPhrase
          };
          break;

        default: // classic
          updateData = {
            ...updateData,
            identifier: data.identifier,
            password: data.password
          };
          break;
      }

      // Mettre à jour dans Firebase
      await updatePassword(data.id, updateData);

      // Mettre à jour l'état local
      setPasswordEntries(prev => prev.map(entry => {
        if (entry.id === data.id) {
          return { ...entry, ...updateData };
        }
        return entry;
      }));

      console.log('Entrée modifiée:', data);
    } catch (error) {
      console.error('Erreur lors de la modification du mot de passe:', error);
      setError('Impossible de modifier le mot de passe');
    }
  };

  const handleDeletePassword = async (id: string) => {
    try {
      // Supprimer de Firebase
      await deletePassword(id);

      // Mettre à jour l'état local
      setPasswordEntries(prev => prev.filter(entry => entry.id !== id));
      console.log('Entrée supprimée:', id);
    } catch (error) {
      console.error('Erreur lors de la suppression du mot de passe:', error);
      setError('Impossible de supprimer le mot de passe');
    }
  };

  // Clic sur une entrée = ouverture en mode visualisation
  const handleEntryClick = (entry: PasswordEntry) => {
    setSelectedEntry(entry);
    setShowViewModal(true);
  };

  // Depuis la vue, passer en mode édition
  const handleEditFromView = () => {
    setShowViewModal(false);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setShowEditModal(false);
    setSelectedEntry(null);
  };

  // Ne pas afficher la liste si pas d'utilisateur connecté
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#121212' }}>
        <p style={{ color: '#F5F5F5' }}>Vous devez être connecté pour accéder à vos mots de passe.</p>
      </div>
    );
  }

  const groupedEntries = passwordEntries.reduce((acc, entry) => {
    if (!acc[entry.section]) {
      acc[entry.section] = [];
    }
    acc[entry.section].push(entry);
    return acc;
  }, {} as Record<string, typeof passwordEntries>);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#121212' }}>
      {/* Zone d'en-tête élégante avec boutons */}
      <div className="relative pt-safe">
        {/* Titre centré */}
        <div className="pt-6 pb-4">
          <h1 className="text-center text-xl font-medium flex items-center justify-center gap-2" style={{ color: '#F5F5F5' }}>
            <img src="/icon192.png" alt="KeyBox Logo" className="h-6 w-6 rounded" />
            KeyBox
          </h1>
          {isLoading && (
            <p className="text-center text-sm mt-2" style={{ color: '#B0B0B0' }}>
              Chargement des mots de passe...
            </p>
          )}
          {error && (
            <p className="text-center text-sm mt-2" style={{ color: '#EF4444' }}>
              {error}
            </p>
          )}
        </div>

        {/* Boutons élégants positionnés */}
        <div className="absolute top-8 left-4 right-4 flex justify-between items-center">
          {/* Bouton Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 border rounded-xl shadow-lg transition-all duration-200"
              style={{
                backgroundColor: '#F97316',
                borderColor: '#F97316',
                color: '#F5F5F5'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
            >
              <Settings size={20} />
            </button>

            {/* Menu Settings */}
            {showSettings && (
              <div
                className="absolute top-16 left-0 border rounded-xl shadow-2xl min-w-48 z-30 overflow-hidden"
                style={{ backgroundColor: '#2A2A2A', borderColor: '#2A2A2A' }}
              >
                <button
                  onClick={() => { setShowChangePassword(true); setShowSettings(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ color: '#F5F5F5' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <KeyRound size={18} />
                  <span>Modifier mon mot de passe</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                  style={{ color: '#F5F5F5' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={18} />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>

          {/* Bouton Add */}
          <button
            onClick={() => setShowAddModal(true)}
            className="p-3 border rounded-xl shadow-lg transition-all duration-200"
            style={{
              backgroundColor: '#F97316',
              borderColor: '#F97316',
              color: '#F5F5F5'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Overlay pour fermer le menu settings */}
      {
        showSettings && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowSettings(false)}
          />
        )
      }

      {/* Séparateur subtil */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent mb-6"></div>

      {/* Info aide */}
      <div className="px-4 mb-4">
        <p className="text-xs text-center" style={{ color: '#888' }}>
          Cliquez sur une entrée pour la voir ou la modifier
        </p>
      </div>

      {/* Liste des entrées */}
      <div className="px-4 pb-24">
        {Object.entries(groupedEntries).map(([section, entries]) => (
          <div key={section} className="mb-8">
            {/* Section alphabétique */}
            <div className="mb-4">
              <div
                className="px-4 py-2 rounded-xl inline-block font-semibold text-lg shadow-sm"
                style={{ backgroundColor: '#F97316', color: '#121212' }}
              >
                {section}
              </div>
            </div>

            {/* Entrées de la section */}
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="border rounded-xl p-4 transition-all duration-200 active:opacity-80 shadow-sm cursor-pointer hover:shadow-lg"
                  style={{ backgroundColor: '#2A2A2A', borderColor: '#2A2A2A' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#F97316';
                    e.currentTarget.style.backgroundColor = '#333';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2A2A2A';
                    e.currentTarget.style.backgroundColor = '#2A2A2A';
                  }}
                  onClick={() => handleEntryClick(entry)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-lg truncate" style={{ color: '#F5F5F5' }}>
                          {entry.title}
                        </h3>
                        {entry.type === 'card' && (
                          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: '#F97316', color: '#121212' }}>
                            CARTE
                          </span>
                        )}
                      </div>
                      <p className="text-sm truncate" style={{ color: '#B0B0B0' }}>
                        {entry.identifier}
                      </p>
                      {entry.type === 'card' && entry.bankName && (
                        <p className="text-xs truncate mt-1" style={{ color: '#888' }}>
                          {entry.bankName}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyPassword(entry.title);
                      }}
                      className="flex flex-col items-center justify-center p-3 border rounded-xl transition-all duration-200 ml-4 shadow-sm"
                      style={{
                        backgroundColor: '#F97316',
                        borderColor: '#F97316',
                        color: '#F5F5F5',
                        minWidth: '80px',
                        width: '80px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                    >
                      <Copy size={18} className="mb-1" />
                      <span className="text-xs text-center leading-tight">Copier</span>
                      <span className="text-xs text-center opacity-80 leading-tight">
                        {entry.type === 'card' ? 'numéro' : 'mot de passe'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Barre de recherche fixe en bas */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-opacity-95 backdrop-blur-sm border-t p-4 pb-safe"
        style={{ backgroundColor: '#121212', borderColor: '#2A2A2A' }}
      >
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: '#B0B0B0' }} />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 shadow-sm"
            style={{
              backgroundColor: '#2A2A2A',
              borderColor: '#2A2A2A',
              color: '#F5F5F5'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}
          />
        </div>
      </div>

      {/* Modal d'ajout de mot de passe */}
      <AddPasswordModal
        isOpen={showAddModal}
        onClose={handleCloseModals}
        onSave={handleAddPassword}
      />

      {/* Modal de visualisation */}
      {
        selectedEntry && (
          <ViewPasswordModal
            isOpen={showViewModal}
            onClose={handleCloseModals}
            onEdit={handleEditFromView}
            onCopy={handleCopyFromModal}
            entry={selectedEntry}
          />
        )
      }

      {/* Modal de modification */}
      {
        selectedEntry && (
          <AddPasswordModal
            isOpen={showEditModal}
            onClose={handleCloseModals}
            onSave={handleEditPassword}
            onDelete={handleDeletePassword}
            editMode={true}
            editData={selectedEntry}
          />
        )
      }

      {/* Notification de copie */}
      <CopyNotification
        isVisible={showCopyNotification}
        entryName={copiedEntryName}
        onHide={() => setShowCopyNotification(false)}
      />
      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onChanged={() => console.info('Mot de passe modifié')}
      />
    </div >
  );
} 