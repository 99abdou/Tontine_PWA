import React, { useEffect } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import { useToastStore, ToastItem } from '../../stores/toastStore';
import clsx from 'clsx';

const ToastMessage: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const duration = toast.duration ?? 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const config = {
    success: {
      icon: CheckCircle2,
      container: 'bg-white border-emerald-500 text-gray-900',
      iconColor: 'text-emerald-600 bg-emerald-50',
      accentBar: 'bg-emerald-500',
    },
    error: {
      icon: AlertCircle,
      container: 'bg-white border-rose-500 text-gray-900',
      iconColor: 'text-rose-600 bg-rose-50',
      accentBar: 'bg-rose-500',
    },
    warning: {
      icon: AlertTriangle,
      container: 'bg-white border-amber-500 text-gray-900',
      iconColor: 'text-amber-600 bg-amber-50',
      accentBar: 'bg-amber-500',
    },
    info: {
      icon: Info,
      container: 'bg-white border-sky-500 text-gray-900',
      iconColor: 'text-sky-600 bg-sky-50',
      accentBar: 'bg-sky-500',
    },
  }[toast.type];

  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={clsx(
        'relative flex items-start gap-3 w-full max-w-sm p-4 rounded-2xl bg-white border border-gray-100/80 shadow-xl shadow-gray-900/10 transition-all duration-300 transform translate-y-0 opacity-100 overflow-hidden select-none pointer-events-auto',
        'animate-in fade-in slide-in-from-top-4'
      )}
    >
      {/* Colored Left Accent Strip */}
      <div className={clsx('absolute left-0 top-0 bottom-0 w-1.5', config.accentBar)} />

      {/* Icon */}
      <div className={clsx('p-2 rounded-xl shrink-0 mt-0.5 ml-1', config.iconColor)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-xs font-bold text-gray-900 leading-snug">{toast.title}</h4>
        {toast.message && (
          <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">{toast.message}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-4 left-4 right-4 sm:left-auto sm:right-5 z-50 flex flex-col gap-2.5 sm:max-w-md pointer-events-none"
    >
      {toasts.map((t) => (
        <ToastMessage key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  );
};
