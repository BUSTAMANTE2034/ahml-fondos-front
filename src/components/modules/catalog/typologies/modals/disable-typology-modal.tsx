import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useTypologies } from '../index/typology-context.js'

const DisableTypologyModal = () => {
  const { 
    isDisableOpen, 
    closeDisable, 
    handleEnable, 
    selected, 
    loadingUpdate 
  } = useTypologies()

  if (!isDisableOpen || !selected) return null

  const onSubmit = async () => {
    await handleEnable(false) // deshabilitar tipología
  }

  return (
    <Modal visible onClose={closeDisable}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Deshabilitar Tipología
          </h2>
          <p className="text-sm">
            ¿Deseas deshabilitar la tipología{' '}
            <strong>"{selected.name}"</strong>?
          </p>
        </div>

        {/* LOADING */}
        {loadingUpdate && (
          <div className="flex items-center justify-center mx-auto gap-4">
            <span className="text-blue-600 font-medium text-lg">
              Deshabilitando...
            </span>
            <Loader size={20} />
          </div>
        )}

        {/* BUTTONS */}
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
              className="cancel"
            >
              <span>Deshabilitar</span>
            </button>
          </div>
        )}

      </div>
    </Modal>
  )
}

export default DisableTypologyModal
