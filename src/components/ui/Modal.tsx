import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  disableSave?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, onSave, disableSave = false }: ModalProps) {
  if (!isOpen) return null;

  const handleSave = () => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
    if (onSave) {
      onSave();
    }
  };

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
          {/* Header */}
          <div className="px-6 py-4 border-b" style={{ borderColor: '#F97316' }}>
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center text-xs md:text-sm"
                style={{ color: '#F5F5F5' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F97316')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#F5F5F5')}
              >
                <X size={18} className="mr-1" />
                <span className="text-sm">Annuler</span>
              </button>

              <h3 className="font-medium truncate text-base md:text-lg" style={{ color: '#F5F5F5', maxWidth: '55%' }}>
                {title}
              </h3>

              <button
                onClick={handleSave}
                className="px-3 py-1 rounded-lg text-xs md:text-sm font-medium transition-colors"
                style={{ backgroundColor: '#F97316', color: '#121212' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EA580C')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F97316')}
                disabled={disableSave}
              >
                Enregistrer
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="text-white" style={{ backgroundColor: '#121212' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}