import Modal from '@ui/modal'
import { useMovements } from '../index/movement-context'
import { formatFecha, getAvailabilityLabel } from '@ui/functions'

const ShowMovementModal = () => {
  const { selected, isShowOpen, closeShow } = useMovements()

  if (!isShowOpen || !selected) return null

  const rf = selected.record_file
  const user = selected.moved_by_user

  const availabilityColor =
    rf?.availability_status === 'available'
      ? 'text-green-600'
      : 'text-red-600'

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-6 px-2 md:px-4">

        {/* ================= HEADER ================= */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Movimiento de expediente
          </h2>
          <p className="text-sm text-dark2-gray">
            Detalles completos del historial del expediente
          </p>
        </div>

        {/* ================= EXPEDIENTE ================= */}
        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-blue-600 text-sm mb-3">
            Expediente
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>
              <span className="font-semibold">Código de clasificación:</span><br />
              {rf?.reference_code ?? '—'}
            </p>

            <p>
              <span className="font-semibold">Estado actual:</span><br />
              <span className={`font-medium ${availabilityColor}`}>
                {getAvailabilityLabel(
                  (rf?.availability_status ?? 'available') as
                    | 'available'
                    | 'on_loan'
                    | 'under_review'
                    | 'unavailable'
                )}
              </span>
            </p>

            <p>
              <span className="font-semibold">Última preservación:</span><br />
              {rf?.last_preservation_date
                ? formatFecha(rf.last_preservation_date)
                : '—'}
            </p>

            <p>
              <span className="font-semibold">Última fecha de fondo:</span><br />
              {rf?.last_fund_date
                ? formatFecha(rf.last_fund_date)
                : '—'}
            </p>

            {rf?.deterioration && (
              <p className="md:col-span-2">
                <span className="font-semibold">Deterioro:</span><br />
                {rf.deterioration.deterioration_name}
              </p>
            )}
          </div>
        </div>

        {/* ================= MOVIMIENTO ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-blue-600 text-sm mb-3">
            Movimiento
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p className="md:col-span-2">
              <span className="font-semibold">Descripción:</span><br />
              {selected.description || 'Sin descripción'}
            </p>

            <p>
              <span className="font-semibold">Estado origen:</span><br />
              {getAvailabilityLabel(
                selected.origin_status || 'available'
              )}
            </p>

            <p>
              <span className="font-semibold">Estado destino:</span><br />
              <span className="font-medium text-blue-600">
                {getAvailabilityLabel(
                  selected.destination_status || 'available'
                )}
              </span>
            </p>

            <p>
              <span className="font-semibold">Fecha del movimiento:</span><br />
              {selected.moved_at
                ? formatFecha(selected.moved_at)
                : '—'}
            </p>

            <p>
              <span className="font-semibold">Creado el:</span><br />
              {selected.created_at
                ? formatFecha(selected.created_at)
                : '—'}
            </p>

            <p>
              <span className="font-semibold">Última actualización:</span><br />
              {selected.updated_at
                ? formatFecha(selected.updated_at)
                : '—'}
            </p>
          </div>
        </div>

        {/* ================= USUARIO ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-blue-600 text-sm mb-2">
            Usuario que ejecutó el movimiento
          </h3>

          {user ? (
            <p className="text-sm">
              <span className="font-semibold">Nombre:</span>{' '}
              {user.first_name} {user.last_name}
              <br />
              <span className="text-xs text-dark2-gray">
                {user.email}
              </span>
            </p>
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

export default ShowMovementModal
