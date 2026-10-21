import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {toasts.map(toast => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />;
            case 'error':
              return <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
            default:
              return <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'border-emerald-200 bg-emerald-50/90';
            case 'warning':
              return 'border-amber-200 bg-amber-50/90';
            case 'error':
              return 'border-rose-200 bg-rose-50/90';
            default:
              return 'border-blue-200 bg-blue-50/90';
          }
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-200 flex items-start justify-between gap-3 ${getBorderColor()}`}
          >
            <div className="flex items-start gap-2.5">
              {getIcon()}
              <div>
                <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{toast.message}</p>
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 shrink-0 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
