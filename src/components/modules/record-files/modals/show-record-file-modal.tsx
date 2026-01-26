import Modal from '@ui/modal'
import { useRecordFiles } from '../index/record-file-context.js'
import {
  formatFecha,
  invertDate,
  getAvailabilityLabel,
  getReadableDocumentSizes,
} from '@ui/functions'

const ShowRecordFileModal = () => {
  const { selected, isShowOpen, closeShow } = useRecordFiles()
  if (!isShowOpen || !selected) return null

  const availabilityColor =
    selected.availability_status === 'available'
      ? 'text-green-600'
      : 'text-red-600'

  return (
    <Modal visible onClose={closeShow} big>
      <div className="flex flex-col gap-6 px-2 md:px-4">

        {/* ================= HEADER ================= */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Expediente documental
          </h2>
          <p className="text-sm text-dark2-gray">
            Información completa del expediente
          </p>
        </div>

        {/* ================= IDENTIDAD ================= */}
        <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p>
              <span className="font-semibold">Código de referencia:</span><br />
              {selected.reference_code}
            </p>

            <p>
              <span className="font-semibold">
                Código de referencia anterior:
              </span><br />
              {selected.previous_reference_code || '—'}
            </p>

            <p className="md:col-span-2">
              <span className="font-semibold">Asunto:</span><br />
              {selected.subject || '—'}
            </p>
          </div>
        </div>

        {/* ================= DATOS GENERALES ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-blue-600 text-sm mb-3">
            Datos generales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <p>
              <span className="font-semibold">Expediente:</span><br />
              {selected.file_number ?? '—'}
            </p>

            <p>
              <span className="font-semibold">Caja:</span><br />
              {selected.box?.box_number ?? '—'}
            </p>

            <p>
              <span className="font-semibold">Páginas:</span><br />
              {selected.page_count ?? '—'}
            </p>

            <p>
              <span className="font-semibold">Tamaño documentos:</span><br />
              {getReadableDocumentSizes(selected.document_sizes) ?? '—'}
            </p>

            <p>
              <span className="font-semibold">Fecha documental:</span><br />
              {selected.file_date
                ? invertDate(selected.file_date)
                : '—'}
            </p>

            <p>
              <span className="font-semibold">Disponibilidad:</span><br />
              <span className={`font-medium ${availabilityColor}`}>
                {getAvailabilityLabel(selected.availability_status)}
              </span>
            </p>

            <p>
              <span className="font-semibold">Datos sensibles:</span><br />
              {selected.sensitive_data ? 'Sí' : 'No'}
            </p>
          </div>

          <div className="mt-3 text-sm">
            <span className="font-semibold">Comentarios:</span>
            <p className="text-dark2-gray">
              {selected.comments || '—'}
            </p>
          </div>
        </div>

        {/* ================= RELACIONES ================= */}
        <div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
          <h3 className="font-bold text-blue-600 text-sm mb-3">
            Clasificación archivística
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <p><strong>Fondo:</strong> {selected.fund?.name || '—'}</p>
            <p><strong>Sección:</strong> {selected.section?.name || '—'}</p>
            <p><strong>Serie:</strong> {selected.series?.name || '—'}</p>
            <p><strong>Localidad:</strong> {selected.location?.name || '—'}</p>
            <p><strong>Deterioro:</strong> {selected.deterioration_status?.name || '—'}</p>
          </div>

          <div className="mt-3 text-sm">
            <span className="font-semibold">Tipologías:</span>
            {selected.typologies?.length ? (
              <div className="flex flex-wrap gap-2 mt-1">
                {selected.typologies.map(t => (
                  <span
                    key={t.id}
                    className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-dark2-gray">—</p>
            )}
          </div>
        </div>

        {/* ================= UBICACIÓN FÍSICA ================= */}
        <div className="p-4 rounded-2xl border border-blue-200 bg-white">
          <h3 className="font-bold text-blue-600 text-sm mb-2">
            Ubicación física
          </h3>

          <p className="text-sm">
            <strong>Estantería:</strong>{' '}
            {selected.box?.physical_location?.code ?? 'Sin ubicación'}
          </p>

          <p className="text-xs text-dark2-gray">
            {selected.box?.physical_location?.description ?? ''}
          </p>
        </div>

        {/* ================= USUARIOS (AUDITORÍA) ================= */}
<div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
  <h3 className="font-bold text-blue-600 text-sm mb-3">
    Usuarios
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

    {/* USUARIO CREADOR */}
    <div>
      <p className="font-semibold mb-1">Usuario creador</p>

      {selected.user ? (
        <p>
          {selected.user.first_name} {selected.user.last_name}<br />
          <span className="text-xs text-dark2-gray">
            {selected.user.email}
          </span>
        </p>
      ) : (
        <span className="text-dark2-gray">—</span>
      )}
    </div>

    {/* USUARIO ACTUALIZADOR */}
    <div>
      <p className="font-semibold mb-1">Última actualización</p>

      {selected.updated_user ? (
        <p>
          {selected.updated_user.first_name}{' '}
          {selected.updated_user.last_name}<br />
          <span className="text-xs text-dark2-gray">
            {selected.updated_user.email}
          </span>
        </p>
      ) : (
        <span className="text-dark2-gray">—</span>
      )}
    </div>

  </div>
</div>

{/* ================= METADATOS ================= */}
<div className="p-4 rounded-2xl border border-dark-gray bg-light-gray">
  <h3 className="font-bold text-blue-600 text-sm mb-2">
    Metadatos del registro
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
    <p>
      <span className="font-semibold">Fecha de creación:</span><br />
      {formatFecha(selected.created_at)}
    </p>

    <p>
      <span className="font-semibold">Última actualización:</span><br />
      {formatFecha(selected.updated_at)}
    </p>
  </div>
</div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-end">
          <button onClick={closeShow} className="cancel">
             <span>Cerrar</span>
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default ShowRecordFileModal
