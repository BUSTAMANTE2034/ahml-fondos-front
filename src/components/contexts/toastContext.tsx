import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Toast, {
  ToastObject,
  ToastErrorIcon,
  ToastErrorBGColor,
  ToastWarningIcon,
  ToastWarningBGColor,
  ToastSuccessIcon,
  ToastSuccessBGColor,
  ToastNotificationIcon,
  ToastNotificationBGColor,
} from '@/components/ui/toast';

export type AddToastParams = {
  id?: number;
  title: string;
  message?: string;
  fixed?: boolean;
};

type ToastContextInterface = {
  toastError: (params: AddToastParams) => void;
  toastSuccess: (params: AddToastParams) => void;
  toastWarning: (params: AddToastParams) => void;
  toastNotification: (params: AddToastParams) => void;
  clearToasts: () => void;
};

const ToastContext = createContext<ToastContextInterface>({} as any);
export const useToast = () => useContext(ToastContext);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider =({ children }: ToastProviderProps) => {
  const location = useLocation();
  const [toastList, setToastList] = useState<ToastObject[]>([]);

  React.useEffect(() => {
    setToastList((prev) => prev.map((t) => ({ ...t, fixed: false })));  
  }, [location.pathname]);

  const removeToast = useCallback((id: number) => {
    setToastList((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast: ToastObject) => {
    setToastList((prev) => {
      if (prev.some((t) => t.id === toast.id)) {
        return prev.map((t) => (t.id === toast.id ? toast : t));
      }
      return [...prev, toast];
    });
  }, []);

  const toastSuccess = useCallback(({ id = Date.now(), title, message, fixed = false }: AddToastParams) => {
    addToast({ id, title, description: message, icon: ToastSuccessIcon, backgroundColor: ToastSuccessBGColor, fixed });
  }, [addToast]);

  const toastError = useCallback(({ id = Date.now(), title, message, fixed = false }: AddToastParams) => {
    addToast({ id, title, description: message, icon: ToastErrorIcon, backgroundColor: ToastErrorBGColor, fixed });
  }, [addToast]);

  const toastWarning = useCallback(({ id = Date.now(), title, message, fixed = false }: AddToastParams) => {
    addToast({ id, title, description: message, icon: ToastWarningIcon, backgroundColor: ToastWarningBGColor, fixed });
  }, [addToast]);

  const toastNotification = useCallback(({ id = Date.now(), title, message, fixed = false }: AddToastParams) => {
    addToast({ id, title, description: message, icon: ToastNotificationIcon, backgroundColor: ToastNotificationBGColor, fixed });
  }, [addToast]);

  const clearToasts = useCallback(() => setToastList([]), []);

  return (
    <ToastContext.Provider
      value={{ toastError, toastSuccess, toastWarning, toastNotification, clearToasts }}
    >
      {children}
      <Toast
        toastList={toastList}
        removeToast={removeToast}
        position="top-right"
        autoDelete
        autoDeleteTime={3500}
        marginTop={0}
      />
    </ToastContext.Provider>
  );
};