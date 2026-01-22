import Modal from '@ui/modal'
import { useBoxes } from '../index/box-context.js'
import { formatFecha } from '@ui/functions'

const ShowBoxModal = () => {
  const { selected, isShowOpen, closeShow } = useBoxes()

  if (!isShowOpen || !selected) return null

  const location = selected.physical_location

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-6 px-2 md:px-4">

        {/* ================= HEADER ================= */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información de la caja
          </h2>
          <p className="text-sm text-dark2-gray">
            Detalles de la caja seleccionada
          </p>
        </div>

        {/* ================= DATOS DE LA CAJA ================= */}
        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Datos de la caja
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>
              <span className="font-semibold">Número de la caja:</span><br />
              {selected.box_number}
            </p>

            <p>
              <span className="font-semibold">Estatus:</span><br />
              <span
                className={
                  selected.is_active
                    ? 'text-green-600 font-medium'
                    : 'text-red-600 font-medium'
                }
              >
                {selected.is_active ? 'Activa' : 'Inactiva'}
              </span>
            </p>

            <p className="md:col-span-2">
              <span className="font-semibold">Descripción:</span><br />
              {selected.description || '—'}
            </p>
          </div>
        </div>
{/* ================= UBICACIÓN FÍSICA ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Ubicación física
          </h3>

          {location ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <span className="font-semibold">Código:</span><br />
                {location.code}
              </p>

              <p>
                <span className="font-semibold">Estatus:</span><br />
                <span
                  className={
                    location.is_active
                      ? 'text-green-600 font-medium'
                      : 'text-red-600 font-medium'
                  }
                >
                  {location.is_active ? 'Activa' : 'Inactiva'}
                </span>
              </p>

              <p className="md:col-span-2">
                <span className="font-semibold">Descripción:</span><br />
                {location.description || '—'}
              </p>
            </div>
          ) : (
            <span className="text-sm">—</span>
          )}
        </div>
        {/* ================= METADATOS ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Metadatos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>
              <span className="font-semibold">Creado el:</span><br />
              {formatFecha(selected.created_at)}
            </p>

            <p>
              <span className="font-semibold">Última actualización:</span><br />
              {formatFecha(selected.updated_at)}
            </p>
          </div>
        </div>

        

        {/* ================= USUARIO CREADOR ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Usuario creador
          </h3>

          {selected.user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <p>
                <span className="font-semibold">Nombre:</span><br />
                {selected.user.first_name} {selected.user.last_name}
              </p>

              <p>
                <span className="font-semibold">Número de empleado:</span><br />
                {selected.user.employee_id || '—'}
              </p>

              <p className="md:col-span-2">
                <span className="font-semibold">Correo:</span><br />
                {selected.user.email}
              </p>
            </div>
          ) : (
            <span className="text-sm">—</span>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end pt-2">
          <button onClick={closeShow} className="cancel">
            <span>Cerrar</span>
          </button>
        </div>

      </div>
    </Modal>
  )
}

export default ShowBoxModal
