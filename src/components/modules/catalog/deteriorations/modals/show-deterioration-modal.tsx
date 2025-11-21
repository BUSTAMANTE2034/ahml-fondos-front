import Modal from '@ui/modal'
import { useDeteriorations } from '../index/deterioration-context.js'
import { formatFecha } from '@ui/functions'

const ShowDeteriorationModal = () => {
  const { selected, isShowOpen, closeShow } = useDeteriorations()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información de la Deterioro
          </h2>
          <p className="text-sm">Detalles del deterioro seleccionado</p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-3 text-sm">

          <p>
            <span className="font-bold">Nombre de la Deterioro: </span>
            {selected.name}
          </p>

          <p>
            <span className="font-bold">Descripción: </span>
            {selected.description ?? '—'}
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

          {/* USUARIO CREADOR */}
          <p className="flex flex-col w-full p-4 bg-light-gray border border-dark-gray rounded-3xl">
            <span className="font-bold">Usuario Creador:</span>

            {selected.user ? (
              <>
                <span>
                  <span className="font-bold">Nombre: </span>
                  {selected.user.first_name} {selected.user.last_name}
                </span>

                <span>
                  <span className="font-bold">Número de empleado: </span>
                  {selected.user.employee_id}
                </span>

                <span>
                  <span className="font-bold">Correo: </span>
                  {selected.user.email}
                </span>
              </>
            ) : (
              <span>—</span>
            )}
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

export default ShowDeteriorationModal
