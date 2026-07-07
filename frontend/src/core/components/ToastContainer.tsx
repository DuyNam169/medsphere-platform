import React from 'react';
import { useToastStore, ToastType } from '../store/toastStore';

const typeConfig: Record<ToastType, { border: string; icon: string; iconBg: string }> = {
  success: { border: 'border-l-[#0f6e56]', icon: '✓', iconBg: 'bg-[#e1f5ee] text-[#0f6e56]' },
  error: { border: 'border-l-[#993c1d]', icon: '!', iconBg: 'bg-[#faece7] text-[#993c1d]' },
  info: { border: 'border-l-[#1c2b4a]', icon: 'i', iconBg: 'bg-[#e6f1fb] text-[#1c2b4a]' },
};

const ToastContainer: React.FC = () => {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => {
        const cfg = typeConfig[toast.type];
        return (
          <div
            key={toast.id}
            onClick={() => dismiss(toast.id)}
            className={`pointer-events-auto cursor-pointer select-none flex items-center gap-2.5
              bg-white border border-gray-200 border-l-4 ${cfg.border}
              px-4 py-2.5 rounded-lg shadow-md text-sm font-medium text-gray-800
              animate-[toastIn_0.2s_ease-out]`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${cfg.iconBg}`}>
              {cfg.icon}
            </span>
            {toast.message}
          </div>
        );
      })}
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;