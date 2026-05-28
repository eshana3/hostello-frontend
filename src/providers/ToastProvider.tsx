"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import clsx from "clsx";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  const icons = {
    success: <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />,
    error:   <XCircle    className="w-4 h-4 text-red-500 flex-shrink-0" />,
    info:    <Info       className="w-4 h-4 text-[#A78BFA] flex-shrink-0" />,
  };

  const borders = {
    success: "border-emerald-200",
    error:   "border-red-200",
    info:    "border-[#4C3699]",
  };

  return (
    <div className={clsx(
      "pointer-events-auto flex items-start gap-3 bg-[#13112A]/95 backdrop-blur-sm border rounded-xl shadow-lg px-4 py-3 min-w-[260px] max-w-[340px]",
      "animate-in slide-in-from-bottom-2 duration-300",
      borders[toast.type]
    )}>
      {icons[toast.type]}
      <p className="text-sm text-[#B5B2D8] flex-1 leading-snug">{toast.message}</p>
      <button onClick={() => onRemove(toast.id)} className="text-[#3D3B62] hover:text-[#7B78A0] transition-colors flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
