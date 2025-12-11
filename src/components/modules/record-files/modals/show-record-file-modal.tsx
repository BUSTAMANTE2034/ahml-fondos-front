import Modal from '@ui/modal'
import { useRecordFiles } from '../index/record-file-context.js'
import { formatFecha, invertDate, getAvailabilityLabel,getReadableDocumentSizes } from '@ui/functions'

const ShowRecordFileModal = () => {
  const { selected, isShowOpen, closeShow } = useRecordFiles()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow} big={true}>
      <div className="flex flex-col gap-6 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información del Expediente
          </h2>
          <p className="text-sm text-dark2-gray">
            Detalles completos del expediente seleccionado.
          </p>
        </div>

        {/* SECCIÓN PRINCIPAL */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2 text-sm">
          <h3 className="font-bold text-blue-600 text-sm mb-1">
            Datos Generales
          </h3>

          <p>
            <span className="font-semibold">Código de Referencia: </span>
            {selected.reference_code}
          </p>
           <p>
            <span className="font-semibold">Código de Referencia Anterior: </span>
            {selected.previous_reference_code}
          </p>

          <p>
            <span className="font-semibold ">Asunto: </span>
            {selected.subject || '—'}
          </p>

          <p>
            <span className="font-semibold">Número de Expediente: </span>
            {selected.file_number ?? '—'}
          </p>

          <p>
            <span className="font-semibold">Número de Caja: </span>
            {selected.box_number ?? '—'}
          </p>

          <p>
            <span className="font-semibold">Páginas: </span>
            {selected.page_count ?? '—'}
          </p>
          <p>
            <span className="font-semibold">Medidad de documentos: </span>
            {getReadableDocumentSizes(selected.document_sizes) ?? '—'}
          </p>

          <p>
            <span className="font-semibold">Fecha Documental: </span>
            {selected.file_date ? invertDate(selected.file_date) : '—'}
          </p>

          <p>
            <span className="font-semibold">Fecha Último Fondo: </span>
            {selected.last_fund_date
              ? invertDate(selected.last_fund_date)
              : '—'}
          </p>

          <p>
            <span className="font-semibold">Fecha Última Preservación: </span>
            {selected.last_preservation_date
              ? invertDate(selected.last_preservation_date)
              : '—'}
          </p>

          <p>
            <span className="font-semibold">Disponibilidad: </span>
            <span
              className={
                selected.availability_status === 'available'
                  ? 'text-green-600 font-medium'
                  : 'text-red-600 font-medium'
              }
            >
              {getAvailabilityLabel(selected.availability_status)}
            </span>
          </p>

          <p>
            <span className="font-semibold">Datos Sensibles: </span>
            {selected.sensitive_data ? 'Sí' : 'No'}
          </p>

          <p>
            <span className="font-semibold">Comentarios: </span>
            {selected.comments || '—'}
          </p>
        </div>

        {/* SECCIÓN RELACIONES */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2 text-sm">
          <h3 className="font-bold text-blue-600 text-sm mb-1">Relaciones</h3>

          <p>
            <span className="font-semibold">Fondo: </span>
            {selected.fund ? selected.fund.name : '—'}
          </p>

          <p>
            <span className="font-semibold">Sección: </span>
            {selected.section ? selected.section.name : '—'}
          </p>

          <p>
            <span className="font-semibold">Serie: </span>
            {selected.series ? selected.series.name : '—'}
          </p>

          <p>
            <span className="font-semibold">Lugar: </span>
            {selected.location ? selected.location.name : '—'}
          </p>

          <p>
            <span className="font-semibold">Deterioro: </span>
            {selected.deterioration_status
              ? selected.deterioration_status.name
              : '—'}
          </p>

          <div className="flex flex-col gap-1">
            <span className="font-semibold">Tipologías:</span>
            {selected.typologies && selected.typologies.length > 0 ? (
              <ul className="list-disc pl-5">
                {selected.typologies.map((t) => (
                  <li key={t.id}>{t.name}</li>
                ))}
              </ul>
            ) : (
              <span>—</span>
            )}
          </div>

          <p>
            <span className="font-semibold">Creado el: </span>
            {formatFecha(selected.created_at)}
          </p>

          <p>
            <span className="font-semibold">Última actualización: </span>
            {formatFecha(selected.updated_at)}
          </p>
        </div>

        {/* USUARIO CREADOR */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray flex flex-col gap-2 text-sm">
          <h3 className="font-bold text-blue-600 text-sm mb-1">
            Usuario Creador
          </h3>

          {selected.user ? (
            <>
              <p>
                <span className="font-semibold">Nombre: </span>
                {selected.user.first_name} {selected.user.last_name}
              </p>

              <p>
                <span className="font-semibold">Correo: </span>
                {selected.user.email}
              </p>
            </>
          ) : (
            <span>—</span>
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

export default ShowRecordFileModal
