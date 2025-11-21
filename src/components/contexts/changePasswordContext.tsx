import { createContext, ReactNode, useContext, useState } from "react";

interface ChangePasswordContextProps {
  isCPModalOpen: boolean;
  openCPModal: () => void;
  closeCPModal: () => void;
}

const ChangePasswordContext = createContext<ChangePasswordContextProps | null>(null);

export const ChangePasswordProvider = ({ children }: { children: ReactNode }) => {
  const [isCPModalOpen, setIsCPModalOpen] = useState(false);

  const openCPModal = () => setIsCPModalOpen(true);
  const closeCPModal = () => setIsCPModalOpen(false);

  return (
    <ChangePasswordContext.Provider value={{ isCPModalOpen, openCPModal, closeCPModal }}>
      {children}
    </ChangePasswordContext.Provider>
  );
};

export const useChangePasswordModal = () => {
  const ctx = useContext(ChangePasswordContext);
  if (!ctx) throw new Error("useChangePasswordModal debe usarse dentro de ChangePasswordProvider");
  return ctx;
};
