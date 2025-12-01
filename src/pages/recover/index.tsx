import { useEffect } from "react";
import ChangePasswordModal from "@/components/layouts/modals/recover-password-modal";
import { useAuth } from "@contexts/authContext";
import { useChangePasswordModal } from "@contexts/changePasswordContext";

const FirstLogin = () => {
  const { user } = useAuth();
  const { openCPModal } = useChangePasswordModal();

  useEffect(() => {
    openCPModal();  
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* SOLO el modal, nada más */}
      <ChangePasswordModal />
    </div>
  );
};

export default FirstLogin;
