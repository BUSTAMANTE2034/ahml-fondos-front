import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { usePhysicalLocations } from '../index/physical_location-context'

const GetPhysicalLocationLabelModal = () => {
  const {
    selected,
    isLabelOpen,
    closeLabel,
    handlePrintLabel,
    loadingPrintLabel,
    errorPrintLabel,
  } = usePhysicalLocations()

  if (!isLabelOpen || !selected) return null

  return (
    <Modal visible onClose={closeLabel} showCloseButton>
      <div className="flex flex-col gap-4 px-2 md:px-4 text-center">

        <div className="flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Descargar etiqueta
          </h2>

          <p className="text-sm">
            Generar y descargar etiqueta de la estantería:
            <br />
            <strong>{selected.code}</strong>
          </p>
        </div>

        {/* ERROR */}
        {errorPrintLabel && (
          <p className="text-red-600 text-sm">
            ⚠ {errorPrintLabel}
          </p>
        )}

        {/* LOADING */}
        {loadingPrintLabel && (
          <div className="flex items-center justify-center gap-4">
            <span className="text-blue-600 font-medium text-lg">
              Generando etiqueta…
            </span>
            <Loader size={22} />
          </div>
        )}

        {/* BOTONES */}
        {!loadingPrintLabel && (
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={closeLabel} className="cancel">
              <span>Cancelar</span>
            </button>

            <button
              onClick={handlePrintLabel}
              className="create"
            >
              <span>Descargar</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default GetPhysicalLocationLabelModal
