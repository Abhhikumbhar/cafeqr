import React from 'react';
import { useCafe } from '../../context/CafeContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useCafe();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all animate-slide-in ${
              isSuccess
                ? 'bg-emerald-900/90 text-emerald-50 border-emerald-700/60'
                : isError
                ? 'bg-rose-900/90 text-rose-50 border-rose-700/60'
                : 'bg-[#241A14]/95 text-[#F8F5F0] border-[#5C3A21]/40'
            }`}
          >
            {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {!isSuccess && !isError && <Info className="w-5 h-5 text-[#E58A3A] shrink-0" />}

            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/60 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
