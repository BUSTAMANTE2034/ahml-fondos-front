import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useLocations } from '../index/location-context.js'

const DisableLocationModal = () => {
  const { 
    isDisableOpen, 
    closeDisable, 
    handleEnable, 
    selected, 
    loadingUpdate 
  } = useLocations()

  if (!isDisableOpen || !selected) return null

  const onSubmit = async () => {
    await handleEnable(false) // deshabilitar ubicación
  }

  return (
    <Modal visible onClose={closeDisable}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Deshabilitar Lugar
          </h2>
          <p className="text-sm">
            ¿Deseas deshabilitar el lugar{' '}
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

export default DisableLocationModal
