import Modal from '@ui/modal'
import { useLoans } from '../index/loan-context'
import { formatFecha, getAvailabilityLabel } from '@ui/functions'

const ShowLoanModal = () => {
  const { selected, isShowOpen, closeShow } = useLoans()
  if (!isShowOpen || !selected) return null

  const rf = selected.record_file

  const availabilityColor =
    rf?.availability_status === 'available'
      ? 'text-green-600'
      : 'text-red-600'

  const loanStatusColor =
    selected.is_active ? 'text-green-600' : 'text-red-600'

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-6 px-2 md:px-4">

        {/* ================= HEADER ================= */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información del préstamo
          </h2>
          <p className="text-sm text-dark2-gray">
            Detalles completos del préstamo seleccionado
          </p>
        </div>

        {/* ================= EXPEDIENTE ================= */}
        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Expediente
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>
              <span className="font-semibold">Código de clasificación:</span><br />
              {rf?.reference_code ?? '—'}
            </p>

            <p>
              <span className="font-semibold">Número de expediente:</span><br />
              {rf?.file_number ?? '—'}
            </p>

            <p className="md:col-span-2">
              <span className="font-semibold">Estado actual:</span><br />
              <span className={`font-medium ${availabilityColor}`}>
                {getAvailabilityLabel(rf?.availability_status || 'available')}
              </span>
            </p>
          </div>
        </div>

        {/* ================= PRÉSTAMO ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-sm text-blue-600 mb-3">
            Información del préstamo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p className="md:col-span-2">
              <span className="font-semibold">Descripción:</span><br />
              {selected.description || 'Sin descripción'}
            </p>

            <p>
              <span className="font-semibold">Estado del préstamo:</span><br />
              <span className={`font-medium ${loanStatusColor}`}>
                {selected.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </p>

            <p>
              <span className="font-semibold">Fecha de préstamo:</span><br />
              {selected.loaded_at ? formatFecha(selected.loaded_at) : '—'}
            </p>

            <p>
              <span className="font-semibold">Fecha de devolución:</span><br />
              {selected.returned_at ? formatFecha(selected.returned_at) : '—'}
            </p>

            <p>
              <span className="font-semibold">Creado el:</span><br />
              {selected.created_at ? formatFecha(selected.created_at) : '—'}
            </p>

            <p>
              <span className="font-semibold">Última actualización:</span><br />
              {selected.updated_at ? formatFecha(selected.updated_at) : '—'}
            </p>
          </div>
        </div>

        {/* ================= USUARIOS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* USUARIO QUE PRESTÓ */}
          <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
            <h3 className="font-bold text-sm text-blue-600 mb-2">
              Usuario que prestó
            </h3>

            {selected.issued_by_user ? (
              <p className="text-sm">
                <strong>Nombre:</strong>{' '}
                {selected.issued_by_user.first_name}{' '}
                {selected.issued_by_user.last_name}
                <br />
                <span className="text-xs text-dark2-gray">
                  {selected.issued_by_user.email}
                </span>
              </p>
            ) : (
              <span className="text-sm">—</span>
            )}
          </div>

          {/* USUARIO QUE RECIBIÓ */}
          <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
            <h3 className="font-bold text-sm text-blue-600 mb-2">
              Usuario que recibió
            </h3>

            {selected.loaded_by_user ? (
              <p className="text-sm">
                <strong>Nombre:</strong>{' '}
                {selected.loaded_by_user.first_name}{' '}
                {selected.loaded_by_user.last_name}
                <br />
                <span className="text-xs text-dark2-gray">
                  {selected.loaded_by_user.email}
                </span>
              </p>
            ) : (
              <span className="text-sm">—</span>
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

export default ShowLoanModal
