import Modal from '@ui/modal'
import { useManagers } from '../index/manager-context'
import { formatFecha, getRoleLabel } from '@ui/functions'

const ShowManagerModal = () => {
  const { selected, isShowOpen, closeShow } = useManagers()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-6 px-2 md:px-4">

        {/* ================= HEADER ================= */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información del gestor
          </h2>
          <p className="text-sm text-dark2-gray">
            Detalles del gestor seleccionado
          </p>
        </div>

        {/* ================= IDENTIDAD ================= */}
        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Datos personales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>
              <span className="font-semibold">Nombre:</span><br />
              {selected.first_name} {selected.last_name}
            </p>

            <p>
              <span className="font-semibold">Correo:</span><br />
              {selected.email}
            </p>

            <p>
              <span className="font-semibold">Número de empleado:</span><br />
              {selected.employee_id ?? '—'}
            </p>

            <p>
              <span className="font-semibold">Rol:</span><br />
              {getRoleLabel(selected.role)}
            </p>
          </div>
        </div>

        {/* ================= ESTADO ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Estado del usuario
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
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
            

            {selected.last_login && (
              <p>
                <span className="font-semibold">Último acceso:</span><br />
                {formatFecha(selected.last_login)}
              </p>
            )}
          </div>
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

export default ShowManagerModal
