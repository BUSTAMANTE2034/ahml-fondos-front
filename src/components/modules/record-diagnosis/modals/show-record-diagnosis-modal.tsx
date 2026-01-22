import Modal from '@ui/modal'
import { useRecordDiagnosis } from '../index/record-diagnosis-context'
import { formatFecha, invertDate } from '@/components/ui/functions'

const ShowRecordDiagnosisModal = () => {
  const { selected, isShowOpen, closeShow } = useRecordDiagnosis()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información de la revisión
          </h2>
          <p className="text-sm">
            Detalles de la revisión seleccionada
          </p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-3 text-sm">

          <p>
            <span className="font-bold">Expediente: </span>
            {selected.record_file
              ? `${selected.record_file.reference_code ?? ''} `
              : '—'}
          </p>

          <p>
            <span className="font-bold">Fecha de revisión: </span>
            {formatFecha(selected.revision_date)}
          </p>

          <p>
            <span className="font-bold">Observaciones: </span>
            {selected.observations || 'Sin observaciones'}
          </p>

          <div className="flex flex-col gap-2 p-4 bg-light-gray border border-dark-gray rounded-3xl">
            <span className="font-bold">Diagnósticos asociados:</span>

            {selected.diagnosis_catalog?.length ? (
              <ul className="list-disc pl-4">
                {selected.diagnosis_catalog.map((d:any) => (
                  <li key={d.id}>
                    <strong>{d.concept}</strong> — {d.detail}
                  </li>
                ))}
              </ul>
            ) : (
              <span>—</span>
            )}
          </div>

          <div className="flex flex-col gap-1 p-4 bg-light-gray border border-dark-gray rounded-3xl">
            <span className="font-bold">Usuario revisor:</span>

            {selected.user ? (
              <>
                <span>
                  <strong>Nombre:</strong>{' '}
                  {selected.user.first_name} {selected.user.last_name}
                </span>
                <span>
                  <strong>Número de empleado:</strong>{' '}
                  {selected.user.employee_id ?? '—'}
                </span>
                <span>
                  <strong>Correo:</strong> {selected.user.email}
                </span>
              </>
            ) : (
              <span>—</span>
            )}
          </div>

          <p>
            <span className="font-bold">Creado el: </span>
            {formatFecha(selected.created_at)}
          </p>

          <p>
            <span className="font-bold">Última actualización: </span>
            {formatFecha(selected.updated_at)}
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

export default ShowRecordDiagnosisModal
