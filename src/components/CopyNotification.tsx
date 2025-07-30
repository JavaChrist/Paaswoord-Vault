import { useEffect } from 'react';

interface CopyNotificationProps {
  isVisible: boolean;
  entryName: string;
  onHide: () => void;
}

export default function CopyNotification({ isVisible, entryName, onHide }: CopyNotificationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onHide();
      }, 3000); // Disparaît après 3 secondes

      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className="px-6 py-4 rounded-xl shadow-2xl max-w-sm mx-4 text-center"
        style={{ backgroundColor: 'rgba(42, 42, 42, 0.95)' }}
      >
        <div className="text-lg font-medium mb-1" style={{ color: '#7DD3FC' }}>
          Mot de passe
        </div>
        <div className="text-lg font-bold mb-1" style={{ color: '#7DD3FC' }}>
          {entryName}
        </div>
        <div className="text-sm" style={{ color: '#7DD3FC' }}>
          copié pour 60s
        </div>
      </div>
    </div>
  );
} 