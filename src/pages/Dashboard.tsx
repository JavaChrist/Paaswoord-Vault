import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Search, Settings, Plus, Copy, LogOut } from 'lucide-react';
import AddPasswordModal from '../components/modals/AddPasswordModal';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Données d'exemple style Sésame
  const [passwordEntries, setPasswordEntries] = useState([
    { id: '1', title: 'Access ID Pro', identifier: 'CG47027L', section: 'A' },
    { id: '2', title: 'Chrono Poste', identifier: 'digit-bal-secretariat-toulouse@edf.fr', section: 'C' },
    { id: '3', title: 'Compte AD Maquette', identifier: 'MCG47027L-A', section: 'C' },
    { id: '4', title: 'Compte AD Mquette VD', identifier: 'MCG47027L', section: 'C' },
    { id: '5', title: 'Compte VD', identifier: 'username', section: 'C' },
    { id: '6', title: 'GitHub', identifier: 'christian@example.com', section: 'G' },
    { id: '7', title: 'WINDOWS', identifier: 'CG47027L', section: 'W' },
  ]);

  const handleCopyPassword = (title: string) => {
    // TODO: Implémenter la copie sécurisée
    console.log(`Copie du mot de passe pour: ${title}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
    setShowSettings(false);
  };

  const handleAddPassword = (data: any) => {
    const firstLetter = data.name.charAt(0).toUpperCase();
    const newEntry = {
      id: `new_${Date.now()}`,
      title: data.name,
      identifier: data.identifier,
      section: firstLetter,
      password: data.password, // Sera chiffré plus tard
      notes: data.notes
    };

    setPasswordEntries(prev => [...prev, newEntry]);
    console.log('Nouveau mot de passe ajouté:', newEntry);
  };

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
          <h1 className="text-center text-xl font-medium" style={{ color: '#F5F5F5' }}>
            Password Vault
          </h1>
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
      {showSettings && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowSettings(false)}
        />
      )}

      {/* Séparateur subtil */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-orange-600 to-transparent mb-6"></div>

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
                  className="border rounded-xl p-4 transition-all duration-200 active:opacity-80 shadow-sm cursor-pointer"
                  style={{ backgroundColor: '#2A2A2A', borderColor: '#2A2A2A' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#F97316'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg mb-1 truncate" style={{ color: '#F5F5F5' }}>
                        {entry.title}
                      </h3>
                      <p className="text-sm truncate" style={{ color: '#B0B0B0' }}>
                        {entry.identifier}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyPassword(entry.title)}
                      className="flex flex-col items-center justify-center p-3 border rounded-xl transition-all duration-200 ml-4 min-w-0 shadow-sm"
                      style={{ backgroundColor: '#F97316', borderColor: '#F97316', color: '#F5F5F5' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EA580C'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F97316'}
                    >
                      <Copy size={18} className="mb-1" />
                      <span className="text-xs text-center">Copier</span>
                      <span className="text-xs text-center opacity-80">mot de passe</span>
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
              color: '#F5F5F5',
              focusRingColor: '#F97316'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#F97316'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#2A2A2A'}
          />
        </div>
      </div>

      {/* Modal d'ajout de mot de passe */}
      <AddPasswordModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddPassword}
      />
    </div>
  );
} 