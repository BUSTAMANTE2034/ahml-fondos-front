import Modal from '@ui/modal'
import { useBoxes } from '../index/box-context.js'
import { formatFecha } from '@ui/functions'

const ShowBoxModal = () => {
  const { selected, isShowOpen, closeShow } = useBoxes()

  if (!isShowOpen || !selected) return null

  const location = selected.physical_location

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información de la Caja
          </h2>
          <p className="text-sm">Detalles de la caja seleccionada</p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-3 text-sm">
          {/* DATOS DE LA CAJA */}
          <p>
            <span className="font-bold">Número de la Caja: </span>
            {selected.box_number}
          </p>

          <p>
            <span className="font-bold">Descripción: </span>
            {selected.description || '—'}
          </p>

          <p>
            <span className="font-bold">Estatus: </span>
            {selected.is_active ? 'Activa' : 'Inactiva'}
          </p>

          <p>
            <span className="font-bold">Creado el: </span>
            {formatFecha(selected.created_at)}
          </p>

          <p>
            <span className="font-bold">Última actualización: </span>
            {formatFecha(selected.updated_at)}
          </p>

          {/* UBICACIÓN FÍSICA */}
          <div className="flex flex-col gap-1 p-4 bg-light-gray border border-dark-gray rounded-3xl">
            <span className="font-bold text-blue-600">
              Ubicación física
            </span>

            {location ? (
              <>
                <span>
                  <span className="font-bold">Código: </span>
                  {location.code}
                </span>

                <span>
                  <span className="font-bold">Descripción: </span>
                  {location.description || '—'}
                </span>

                <span>
                  <span className="font-bold">Estatus: </span>
                  {location.is_active ? 'Activa' : 'Inactiva'}
                </span>
              </>
            ) : (
              <span>—</span>
            )}
          </div>

          {/* USUARIO CREADOR */}
          <div className="flex flex-col gap-1 p-4 bg-light-gray border border-dark-gray rounded-3xl">
            <span className="font-bold text-blue-600">
              Usuario creador
            </span>

            {selected.user ? (
              <>
                <span>
                  <span className="font-bold">Nombre: </span>
                  {selected.user.first_name} {selected.user.last_name}
                </span>

                <span>
                  <span className="font-bold">Número de empleado: </span>
                  {selected.user.employee_id || '—'}
                </span>

                <span>
                  <span className="font-bold">Correo: </span>
                  {selected.user.email}
                </span>
              </>
            ) : (
              <span>—</span>
            )}
          </div>
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

export default ShowBoxModal
