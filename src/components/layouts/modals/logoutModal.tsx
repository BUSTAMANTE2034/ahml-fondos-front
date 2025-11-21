import Modal from '@ui/modal'
import { useAuth } from '@contexts/authContext'
import { useToast } from '@contexts/toastContext'
import { useLogout } from '@contexts/logoutContext'

const LogoutModal = () => {
  const { logout } = useAuth()
  const { toastSuccess, toastError, toastWarning } = useToast()
  const { isLogoutModalOpen, closeLogoutModal } = useLogout()

  const handleLogout = async () => {
    closeLogoutModal()
    await logout()

    toastSuccess({
      id: 99,
      title: '¡Éxito!',
      message: 'Cierre de sesión exitoso',
    })
  }

  if (!isLogoutModalOpen) return null

  return (
    <Modal visible={isLogoutModalOpen} onClose={closeLogoutModal}>
        <div className="text-center gap-2 flex flex-col mb-6">
          <h2 className=" text-xl md:text-2xl font-bold text-blue-600">
            ¿Deseas cerrar sesión?
          </h2>
          <p className="text-sm">
            Esta acción cerrará la sesión actual y te regresará a la pantalla de
            inicio.
          </p>
        </div>

        <div className="flex justify-end space-x-4">
          <button onClick={closeLogoutModal} className="cancel">
            <span> Cancelar</span>
          </button>
          <button onClick={handleLogout} className="delete">
            <span>Salir</span>
          </button>
        </div>
    </Modal>
  )
}

export default LogoutModal
