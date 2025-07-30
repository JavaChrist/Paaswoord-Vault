import { Lock } from 'lucide-react';

interface LoadingScreenProps {
  isVisible: boolean;
}

export default function LoadingScreen({ isVisible }: LoadingScreenProps) {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#121212' }}
    >
      {/* Icône cadenas au centre */}
      <div className="flex flex-col items-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-pulse"
          style={{ backgroundColor: '#F97316' }}
        >
          <Lock size={40} style={{ color: '#121212' }} />
        </div>
        
        {/* Optionnel: petit indicateur de chargement */}
        <div className="flex space-x-1">
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: '#F97316', animationDelay: '0ms' }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: '#F97316', animationDelay: '150ms' }}
          />
          <div 
            className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: '#F97316', animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
} 