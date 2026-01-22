import Modal from '@ui/modal'
import { useKeys } from '../index/key-context'
import { formatFecha, getEntyityLabel } from '@ui/functions'

const ShowKeyModal = () => {
  const { selected, isShowOpen, closeShow } = useKeys()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-6 px-2 md:px-4">

        {/* ================= HEADER ================= */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información de la clave
          </h2>
          <p className="text-sm text-dark2-gray">
            Detalles de la clave seleccionada
          </p>
        </div>

        {/* ================= DATOS DE LA CLAVE ================= */}
        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Datos de la clave
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>
              <span className="font-semibold">Nombre:</span><br />
              {selected.name}
            </p>

            <p>
              <span className="font-semibold">Clave:</span><br />
              {selected.key}
            </p>

            <p>
              <span className="font-semibold">Tipo de entidad:</span><br />
              {getEntyityLabel(selected.entity_type)}
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
                {selected.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </p>
          </div>

          <div className="mt-3 text-sm">
            <span className="font-semibold">Descripción:</span>
            <p className="text-dark2-gray">
              {selected.description || '—'}
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
                <span className="font-semibold">No. empleado:</span><br />
                {selected.user.employee_id ?? '—'}
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

export default ShowKeyModal
