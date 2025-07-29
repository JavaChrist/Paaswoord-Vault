import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
}

export default function Modal({ isOpen, onClose, title, children, onSave }: ModalProps) {
  if (!isOpen) return null;

  const handleSave = () => {
    // Déclenche la soumission du formulaire
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
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-100 shadow-2xl transition-all">
          {/* Header */}
          <div className="bg-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={onClose}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <X size={18} className="mr-1" />
                <span className="text-sm">Annuler</span>
              </button>

              <h3 className="text-lg font-medium text-gray-900">
                {title}
              </h3>

              <button
                onClick={handleSave}
                className="bg-gray-800 text-white px-4 py-1 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-900 text-white">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 