import Modal from '@ui/modal'
import { useRecordDiagnosis } from '../index/record-diagnosis-context'
import { formatFecha } from '@/components/ui/functions'

const ShowRecordDiagnosisModal = () => {
  const { selected, isShowOpen, closeShow } = useRecordDiagnosis()

  if (!isShowOpen || !selected) return null

  const diagnosisCatalog = selected.diagnosis_catalog ?? []

  const groupedByConcept = diagnosisCatalog.reduce(
    (acc: Record<string, typeof diagnosisCatalog>, item) => {
      if (!acc[item.concept]) acc[item.concept] = []
      acc[item.concept].push(item)
      return acc
    },
    {}
  )

  return (
    <Modal visible onClose={closeShow} big>
      <div className="flex flex-col gap-6 px-2 md:px-4">

        {/* ================= HEADER ================= */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información de la revisión
          </h2>
          <p className="text-sm text-dark2-gray">
            Detalles de la revisión seleccionada
          </p>
        </div>

        {/* ================= DATOS GENERALES ================= */}
        {/* ================= DATOS GENERALES ================= */}
<div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
  <h3 className="font-bold text-sm text-blue-600 mb-3">
    Datos generales
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
    <p>
      <span className="font-semibold">Expediente:</span><br />
      {selected.record_file?.reference_code ?? '—'}
    </p>

    <p>
      <span className="font-semibold">Fecha de revisión:</span><br />
      {formatFecha(selected.revision_date)}
    </p>

    <p className="md:col-span-2">
      <span className="font-semibold">Observaciones:</span><br />
      {selected.observations || '—'}
    </p>
  </div>
</div>


        {/* ================= DIAGNÓSTICOS (NO TOCAR) ================= */}
        <div className="flex flex-col gap-3 p-4 bg-light-gray border border-dark-gray rounded-3xl">
          <span className="font-bold text-base">Diagnósticos</span>

          {diagnosisCatalog.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(groupedByConcept).map(([concept, items]) => (
                <div
                  key={concept}
                  className="
                    p-4
                    rounded-2xl
                    border border-blue-200
                    bg-white
                    shadow-sm
                  "
                >
                  <span className="block text-sm font-bold text-blue-600 uppercase tracking-wide mb-2">
                    {concept}
                  </span>

                  <ul className="list-disc pl-5 flex flex-col gap-1">
                    {items.map((d) => (
                      <li key={d.id} className="text-sm text-gray-700">
                        {d.detail || 'Sin detalle'}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <span>—</span>
          )}
        </div>

        {/* ================= USUARIO REVISOR ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-blue-600 text-sm mb-2">
            Usuario revisor
          </h3>

          {selected.user ? (
            <div className="text-sm flex flex-col gap-1">
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
            </div>
          ) : (
            <span className="text-sm">—</span>
          )}
        </div>

        {/* ================= METADATOS ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-blue-600 text-sm mb-2">
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

export default ShowRecordDiagnosisModal
