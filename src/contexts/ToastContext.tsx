import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', durationMs = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, durationMs);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1000] space-y-2 px-4 w-full max-w-md">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="rounded-lg px-4 py-3 shadow-lg text-sm"
            style={{
              backgroundColor: t.type === 'success' ? '#14532D' : t.type === 'error' ? '#7F1D1D' : '#1F2937',
              color: '#F5F5F5',
              border: '1px solid',
              borderColor: t.type === 'success' ? '#16A34A' : t.type === 'error' ? '#DC2626' : '#374151'
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}


