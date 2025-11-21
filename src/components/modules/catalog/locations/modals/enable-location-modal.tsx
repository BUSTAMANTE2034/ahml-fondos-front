import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useLocations } from '../index/location-context.js'

const EnableLocationModal = () => {
  const { 
    isEnableOpen, 
    closeEnable, 
    handleEnable,
    selected, 
    loadingUpdate 
  } = useLocations()

  if (!isEnableOpen || !selected) return null

  const onSubmit = async () => {
    await handleEnable(true) // habilitar ubicación
  }

  return (
    <Modal visible onClose={closeEnable}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Habilitar Ubicación
          </h2>

          <p className="text-sm">
            ¿Deseas habilitar nuevamente la ubicación{' '}
            <strong>"{selected.name}"</strong>?
          </p>
        </div>

        {/* LOADING */}
        {loadingUpdate && (
          <div className="flex items-center justify-center mx-auto gap-4">
            <span className="text-blue-600 font-medium text-lg">
              Habilitando...
            </span>
            <Loader size={20} />
          </div>
        )}

        {/* BUTTONS */}
        {!loadingUpdate && (
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={closeEnable}
              className="cancel"
            >
              <span>Cancelar</span>
            </button>

            <button 
              onClick={onSubmit} 
              className="create"
            >
              <span>Habilitar</span>
            </button>
          </div>
        )}

      </div>
    </Modal>
  )
}

export default EnableLocationModal
