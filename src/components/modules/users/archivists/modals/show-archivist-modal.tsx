import Modal from '@ui/modal'
import { useArchivists } from '../index/archivist-context'
import { formatFecha,getRoleLabel } from '@ui/functions'

const ShowArchivistModal = () => {
  const { selected, isShowOpen, closeShow } = useArchivists()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información del Archivista
          </h2>
          <p className="text-sm">
            Detalles del archivista seleccionado.
          </p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-3 text-sm">

          <p>
            <span className="font-bold">Nombre: </span>
            {selected.first_name} {selected.last_name}
          </p>

          <p>
            <span className="font-bold">Correo: </span>
            {selected.email}
          </p>

          <p>
            <span className="font-bold">Número de empleado: </span>
            {selected.employee_id ?? 'No registrado'}
          </p>

          <p>
            <span className="font-bold">Rol: </span>
            {getRoleLabel(selected.role)}
          </p>

          <p>
            <span className="font-bold">Estatus: </span>
            {selected.is_active ? 'Activo' : 'Inactivo'}
          </p>

          {selected.last_login && (
            <p>
              <span className="font-bold">Último acceso: </span>
              {formatFecha (selected.last_login)}
            </p>
          )}
        </div>

        {/* BOTÓN */}
        <div className="flex justify-end pt-4">
          <button onClick={closeShow} className="cancel">
            <span>Cerrar</span>
          </button>
        </div>

      </div>
    </Modal>
  )
}

export default ShowArchivistModal
