import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useRecordFiles } from '../index/record-file-context'

const ReceiveLoanModal = () => {
  const {
    isReceiveOpen,
    closeReceive,
    handleReceive,
    selected,
    loadingReceive,
  } = useRecordFiles()

  if (!isReceiveOpen || !selected) return null

  const onSubmit = async () => {
    await handleReceive()
  }

  return (
    <Modal visible onClose={closeReceive}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Marcar como devuelto
          </h2>

          <p className="text-sm">
            ¿Deseas marcar como devuelto el préstamo del expediente{" "}
            <strong>{selected.reference_code}</strong>?
          </p>

         
        </div>

        {/* LOADING */}
        {loadingReceive && (
          <div className="flex items-center justify-center mx-auto gap-4">
            <span className="text-blue-600 font-medium text-lg">
              Procesando...
            </span>
            <Loader size={20} />
          </div>
        )}

        {/* BUTTONS */}
        {!loadingReceive && (
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={closeReceive}
              className="cancel"
            >
              <span>Cancelar</span>
            </button>

            <button
              onClick={onSubmit}
              className="create"
            >
              <span>Confirmar devolución</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ReceiveLoanModal
