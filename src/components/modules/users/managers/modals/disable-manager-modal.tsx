import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useManagers } from '../index/manager-context'

const DisableManagerModal = () => {
  const { 
    isDisableOpen, 
    closeDisable, 
    handleEnable, 
    selected, 
    loadingUpdate 
  } = useManagers()

  if (!isDisableOpen || !selected) return null

  const onSubmit = async () => {
    await handleEnable(false) // deshabilitar
  }

  return (
    <Modal visible onClose={closeDisable}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* Encabezado */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Deshabilitar Gestor
          </h2>
          <p className="text-sm">
            ¿Deseas deshabilitar al gestor{' '}
            <strong>"{selected.first_name}"</strong>?
          </p>
        </div>

        {/* Loader */}
        {loadingUpdate && (
          <div className="flex items-center justify-center mx-auto gap-4">
            <span className="text-blue-600 font-medium text-lg">
              Deshabilitando...
            </span>
            <Loader size={20} />
          </div>
        )}

        {/* Botones */}
        {!loadingUpdate && (
          <div className="flex justify-end gap-4 pt-4">
            <button 
              type="button" 
              onClick={closeDisable} 
              className="cancel"
            >
              <span>Cancelar</span>
            </button>

            <button 
              onClick={onSubmit} 
              className="cancel"   // igual que tu DisableEditorModal
            >
              <span>Deshabilitar</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default DisableManagerModal
