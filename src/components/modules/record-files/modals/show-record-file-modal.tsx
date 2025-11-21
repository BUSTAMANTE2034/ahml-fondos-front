import Modal from '@ui/modal'
import { useRecordFiles } from '../index/record-file-context.js'
import { formatFecha, invertDate, getAvailabilityLabel } from '@ui/functions'

const ShowRecordFileModal = () => {
  const { selected, isShowOpen, closeShow } = useRecordFiles()

  if (!isShowOpen || !selected) return null

  return (
    <Modal visible onClose={closeShow}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Información del Expediente
          </h2>
          <p className="text-sm">Detalles del expediente seleccionado</p>
        </div>

        {/* CONTENIDO */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="bg-gray-0 flex flex-col w-full p-4 ay border border-dark-gray rounded-3xl">
            {' '}
            <p>
              <span className="font-bold">Código de Referencia: </span>
              {selected.reference_code}
            </p>
            <p>
              <span className="font-bold">Asunto: </span>
              {selected.subject}
            </p>
            <p>
              <span className="font-bold">Número de Expediente: </span>
              {selected.file_number ?? '—'}
            </p>
            <p>
              <span className="font-bold">Número de Caja: </span>
              {selected.box_number ?? '—'}
            </p>
            <p>
              <span className="font-bold">Páginas: </span>
              {selected.page_count ?? '—'}
            </p>
            <p>
              <span className="font-bold">Fecha Documental: </span>
              {selected.file_date ? invertDate(selected.file_date) : '—'}
            </p>
            <p>
              <span className="font-bold">Fecha Último Fondo: </span>
              {selected.last_fund_date
                ? invertDate(selected.last_fund_date)
                : '—'}
            </p>
            <p>
              <span className="font-bold">Fecha Última Preservación: </span>
              {selected.last_preservation_date
                ? invertDate(selected.last_preservation_date)
                : '—'}
            </p>
            <p>
              <span className="font-bold">Disponibilidad: </span>
              {getAvailabilityLabel(selected.availability_status)}
            </p>
            <p>
              <span className="font-bold">Datos Sensibles: </span>
              {selected.sensitive_data ? 'Sí' : 'No'}
            </p>
            <p>
              <span className="font-bold">Comentarios: </span>
              {selected.comments || '—'}
            </p>
          </div>
          {/* RELACIONES */}
          {/* <hr className="my-2" /> */}

          <div className="bg-gray-0 flex flex-col w-full p-4 ay border border-dark-gray rounded-3xl">
            <p>
              <span className="font-bold">Fondo: </span>
              {selected.fund ? selected.fund.name : '—'}
            </p>
            <p>
              <span className="font-bold">Sección: </span>
              {selected.section ? selected.section.name : '—'}
            </p>
            <p>
              <span className="font-bold">Serie: </span>
              {selected.series ? selected.series.name : '—'}
            </p>
            <p>
              <span className="font-bold">Ubicación: </span>
              {selected.location ? selected.location.name : '—'}
            </p>
            <p>
              <span className="font-bold">Deterioro: </span>
              {selected.deterioration_status
                ? selected.deterioration_status.name
                : '—'}
            </p>
            {/* LISTA DE TIPOLOGÍAS */}
            <p className="flex flex-col gap-1">
              <span className="font-bold">Tipologías: </span>
              {selected.typologies && selected.typologies.length > 0 ? (
                <ul className="list-disc pl-5">
                  {selected.typologies.map((t) => (
                    <li key={t.id}>{t.name}</li>
                  ))}
                </ul>
              ) : (
                <span>—</span>
              )}
            </p>
            {/* FECHAS DEL SISTEMA */}
            <p>
              <span className="font-bold">Creado el: </span>
              {formatFecha(selected.created_at)}
            </p>
            <p>
              <span className="font-bold">Última actualización: </span>
              {formatFecha(selected.updated_at)}
            </p>
          </div>

          {/* USUARIO CREADOR */}
          <p className="flex flex-col w-full p-4 bg-light-gray border border-dark-gray rounded-3xl">
            <span className="font-bold">Usuario Creador:</span>

            {selected.user ? (
              <>
                <span>
                  <span className="font-bold">Nombre: </span>
                  {selected.user.first_name} {selected.user.last_name}
                </span>

                <span>
                  <span className="font-bold">Correo: </span>
                  {selected.user.email}
                </span>
              </>
            ) : (
              <span>—</span>
            )}
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

export default ShowRecordFileModal
