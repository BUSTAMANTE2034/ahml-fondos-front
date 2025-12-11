import Modal from '@ui/modal'
import { useSeries } from '../index/series-context.js'
import { formatFecha } from '@ui/functions'

const ShowSectionModal = () => {
  const { selected, isShowOpen, closeShow } = useSeries()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información del Serie
          </h2>
          <p className="text-sm">Detalles de la serie seleccionada</p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-3 text-sm">
          <p>
            <span className="font-bold">Nombre del Serie: </span>
            {selected.name}
          </p>

          <p>
            <span className="font-bold">Sigla: </span>
            {selected.acronym ?? '—'}
          </p>

          <p>
            <span className="font-bold">Clave de Catálogo: </span>
            {selected.catalog_key
              ? `${selected.catalog_key.key} - ${selected.catalog_key.name}`
              : 'Sin clave asignada'}
          </p>

          <p>
            <span className="font-bold">Fecha Inicio: </span>
            {selected.start_date ? formatFecha(selected.start_date) : '—'}
          </p>

          <p>
            <span className="font-bold">Fecha Fin: </span>
            {selected.end_date ? formatFecha(selected.end_date) : '—'}
          </p>

          <p>
            <span className="font-bold">Estatus: </span>
            {selected.is_active ? 'Activo' : 'Inactivo'}
          </p>

          <p>
            <span className="font-bold">Creado el: </span>
            {formatFecha(selected.created_at)}
          </p>

          <p>
            <span className="font-bold">Última actualización: </span>
            {formatFecha(selected.updated_at)}
          </p>
          <p className="flex flex-col w-full p-4 bg-light-gray border border-dark-gray rounded-3xl">
            <span className="font-bold">Usuario Creador:</span>

            {selected.user ? (
              <>
                <span>
                  <span className="font-bold">Nombre: </span>
                  {selected.user.first_name} {selected.user.last_name}
                </span>
                <span>
                  <span className="font-bold">Númeor de empleado: </span>
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

export default ShowSectionModal
