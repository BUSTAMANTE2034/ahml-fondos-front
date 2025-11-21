import Modal from '@ui/modal'
import { useKeys } from '../index/key-context'
import { formatFecha, getEntyityLabel } from '@ui/functions'

const ShowKeyModal = () => {
  const { selected, isShowOpen, closeShow } = useKeys()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información de la Clave
          </h2>
          <p className="text-sm">Detalles de la clave seleccionada</p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-3 text-sm">
          <p>
            <span className="font-bold">Nombre: </span>
            {selected.name}
          </p>{' '}
          <p>
            <span className="font-bold">Clave: </span>
            {selected.key}
          </p>
          <p>
            <span className="font-bold">Tipo de Entidad: </span>
            {getEntyityLabel(selected.entity_type)}
          </p>
          <p>
            <span className="font-bold">Descripción: </span>
            {selected.description}
          </p>
          <p>
            <span className="font-bold">Estatus: </span>
            {selected.is_active ? 'Activo' : 'Inactivo'}
          </p>
          <p className="flex flex-col w-full p-4 bg-light-gray border border-dark-gray rounded-3xl">
            <span className="font-bold">Usuario creador:</span>

            <span>
              <span className="font-bold">Nombre: </span>
              {selected.user.first_name} {selected.user.last_name}
            </span>

            <span>
              <span className="font-bold">No. Empleado: </span>
              {selected.user.employee_id}
            </span>

            <span>
              <span className="font-bold">Correo: </span>
              {selected.user.email}
            </span>
          </p>
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

export default ShowKeyModal
