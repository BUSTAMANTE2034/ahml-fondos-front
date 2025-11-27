import Modal from '@ui/modal'
import { useMovements } from '../index/movement-context'
import { formatFecha, getAvailabilityLabel } from '@ui/functions'

const ShowMovementModal = () => {
  const { selected, isShowOpen, closeShow } = useMovements()

  if (!isShowOpen || !selected) return null

  const rf = selected.record_file
  const user = selected.moved_by_user

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-6 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información del Movimiento
          </h2>
          <p className="text-sm text-dark2-gray">
            Detalles completos del historial del expediente.
          </p>
        </div>

        {/* SECCIÓN EXPEDIENTE */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2">
          <h3 className="font-bold text-sm text-blue-600">Expediente</h3>

          <div className="text-sm flex flex-col gap-1">
            <div>
              <span className="font-semibold">Código de clasificación: </span>
              {rf?.reference_code ?? '—'}
            </div>

            <div>
              <span className="font-semibold">Estado actual: </span>
              <span
                className={
                  rf?.availability_status === 'available'
                    ? 'text-green-600 font-medium'
                    : 'text-red-600 font-medium'
                }
              >
                {getAvailabilityLabel(
                  (rf?.availability_status ?? 'available') as
                    | 'available'
                    | 'on_loan'
                    | 'under_review'
                    | 'unavailable'
                )}
              </span>
            </div>

            <div>
              <span className="font-semibold">Última preservación: </span>
              {rf?.last_preservation_date
                ? formatFecha(rf.last_preservation_date)
                : '—'}
            </div>

            <div>
              <span className="font-semibold">Última fecha de fondo: </span>
              {rf?.last_fund_date ? formatFecha(rf.last_fund_date) : '—'}
            </div>

            {rf?.deterioration && (
              <div>
                <span className="font-semibold">Deterioro: </span>
                {rf.deterioration.deterioration_name}
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN MOVIMIENTO */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2">
          <h3 className="font-bold text-sm text-blue-600">Movimiento</h3>

          <div className="text-sm flex flex-col gap-1">
            <div>
              <span className="font-semibold">Descripción: </span>
              {selected.description || '—'}
            </div>

            <div>
              <span className="font-semibold">Estado origen: </span>
              {getAvailabilityLabel(selected.origin_status||'available') ?? '—'}
            </div>

            <div>
              <span className="font-semibold">Estado destino: </span>
              <span className="font-medium text-blue-600">
                {getAvailabilityLabel(selected.destination_status||'available')}
              </span>
            </div>

            <div>
              <span className="font-semibold">Fecha del movimiento: </span>
              {selected.moved_at ? formatFecha(selected.moved_at) : '—'}
            </div>

            <div>
              <span className="font-semibold">Creado el: </span>
              {selected.created_at ? formatFecha(selected.created_at) : '—'}
            </div>

            <div>
              <span className="font-semibold">Última actualización: </span>
              {selected.updated_at ? formatFecha(selected.updated_at) : '—'}
            </div>
          </div>
        </div>

        {/* SECCIÓN USUARIO */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2">
          <h3 className="font-bold text-sm text-blue-600">
            Usuario que ejecutó el movimiento
          </h3>

          {user ? (
            <>
              <span className="text-sm">
                <span className="font-semibold">Nombre: </span>
                {user.first_name} {user.last_name}
              </span>

              <span className="text-sm">
                <span className="font-semibold">Correo: </span>
                {user.email}
              </span>
            </>
          ) : (
            <span className="text-sm">—</span>
          )}
        </div>

        {/* BOTÓN */}
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
