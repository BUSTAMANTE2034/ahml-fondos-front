import Modal from "@ui/modal"
import Loader from "@ui/loader"
import { useRecordFiles } from "../index/record-file-context.js"

const GetRecordFileCoverModal = () => {
  const {
    selected,
    isCoverOpen,
    closeCover,
    handlePrintCover,
    loadingPrint,
    errorPrint,
  } = useRecordFiles()

  if (!isCoverOpen || !selected) return null

  return (
    <Modal visible onClose={closeCover} showCloseButton={true}>
      <div className="flex flex-col gap-4 px-2 md:px-4 text-center">

        <div className="flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Descargar Carátula
          </h2>

          <p className="text-sm">
            Generar y descargar carátula del expediente:
            <br />
            <strong>{selected.reference_code}</strong>
          </p>
        </div>

        {/* ERROR */}
        {errorPrint && (
          <p className="text-red-600 text-sm">
            ⚠ {errorPrint}
          </p>
        )}

        {/* LOADING */}
        {loadingPrint && (
          <div className="flex items-center justify-center gap-4">
            <span className="text-blue-600 font-medium text-lg">
              Generando carátula…
            </span>
            <Loader size={22} />
          </div>
        )}

        {/* BOTONES */}
        {!loadingPrint && (
          <div className="flex justify-end gap-4 pt-4">
            <button onClick={closeCover} className="cancel">
              <span>Cancelar</span>
            </button>

            <button
              onClick={handlePrintCover}
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

export default GetRecordFileCoverModal
