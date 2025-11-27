import Modal from '@ui/modal'
import { useLoans } from '../index/loan-context'
import { formatFecha, getAvailabilityLabel } from '@ui/functions'

const ShowLoanModal = () => {
  const { selected, isShowOpen, closeShow } = useLoans()

  if (!isShowOpen || !selected) return null

  const rf = selected.record_file

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-6 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información del Préstamo
          </h2>
          <p className="text-sm text-dark2-gray">Detalles completos del préstamo seleccionado.</p>
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
              <span className="font-semibold">Número de expediente: </span>
              {rf?.file_number ?? '—'}
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
                {getAvailabilityLabel(rf?.availability_status || 'available')}
              </span>
            </div>
          </div>
        </div>

        {/* SECCIÓN PRÉSTAMO */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2">
          <h3 className="font-bold text-sm text-blue-600">Préstamo</h3>

          <div className="text-sm flex flex-col gap-1">
            <div>
              <span className="font-semibold">Descripción: </span>
              {selected.description || '—'}
            </div>

            <div>
              <span className="font-semibold">Estado del préstamo: </span>
              <span
                className={
                  selected.is_active
                    ? 'text-green-600 font-medium'
                    : 'text-red-600 font-medium'
                }
              >
                {selected.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div>
              <span className="font-semibold">Fecha de préstamo: </span>
              {selected.loaded_at ? formatFecha(selected.loaded_at) : '—'}
            </div>

            <div>
              <span className="font-semibold">Fecha de devolución: </span>
              {selected.returned_at ? formatFecha(selected.returned_at) : '—'}
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

        {/* SECCIÓN USUARIOS */}
        <div className="flex flex-col gap-4">

          {/* USUARIO QUE PRESTÓ */}
          <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2">
            <h3 className="font-bold text-sm text-blue-600">Usuario que prestó</h3>
            {selected.issued_by_user ? (
              <>
                <span className="text-sm">
                  <span className="font-semibold">Nombre: </span>
                  {selected.issued_by_user.first_name}{' '}
                  {selected.issued_by_user.last_name}
                </span>

                <span className="text-sm">
                  <span className="font-semibold">Correo: </span>
                  {selected.issued_by_user.email}
                </span>
              </>
            ) : (
              <span className="text-sm">—</span>
            )}
          </div>

          {/* USUARIO QUE DEVOLVIÓ */}
          <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2">
            <h3 className="font-bold text-sm text-blue-600">Usuario que recibió</h3>
            {selected.loaded_by_user ? (
              <>
                <span className="text-sm">
                  <span className="font-semibold">Nombre: </span>
                  {selected.loaded_by_user.first_name}{' '}
                  {selected.loaded_by_user.last_name}
                </span>

                <span className="text-sm">
                  <span className="font-semibold">Correo: </span>
                  {selected.loaded_by_user.email}
                </span>
              </>
            ) : (
              <span className="text-sm">—</span>
            )}
          </div>

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

export default ShowLoanModal
