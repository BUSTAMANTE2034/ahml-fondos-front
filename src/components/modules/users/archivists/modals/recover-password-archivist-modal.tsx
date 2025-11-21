import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useArchivists} from '../index/archivist-context'

const RecoverPasswordModal = () => {
  const {
    isRecoverOpen,
    closeRecover,
    selected,
    loadingRecover,
    handleRecoverPassword
  } = useArchivists()

  if (!isRecoverOpen || !selected) return null

  const onSubmit = async () => {
    await handleRecoverPassword(selected.id)
  }

  return (
    <Modal visible onClose={closeRecover}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Recuperar contraseña
          </h2>
          <p className="text-sm">
            ¿Deseas generar una contraseña temporal para{' '}
            <strong>{selected.first_name} {selected.last_name}</strong>?
            Se enviará un correo automáticamente.
          </p>
        </div>

        {/* LOADING */}
        {loadingRecover && (
          <div className="flex items-center justify-center mx-auto gap-4">
            <span className="text-blue-600 font-medium text-lg">
              Procesando...
            </span>
            <Loader size={20} />
          </div>
        )}

        {/* BUTTONS */}
        {!loadingRecover && (
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={closeRecover} className="cancel">
              <span>Cancelar</span>
            </button>

            <button onClick={onSubmit} className="create">
              <span>Generar contraseña</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default RecoverPasswordModal
