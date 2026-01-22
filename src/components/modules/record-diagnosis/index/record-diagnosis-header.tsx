import { useLocation, useNavigate, useParams } from 'react-router-dom'
const RecordDiagnosisHeader = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { record_file_id } = useParams<{ record_file_id?: string }>()

  const pathname = location.pathname

  const isList = pathname.endsWith('/record_diagnosis')
  const isNew = pathname.includes('/new_diagnosis')
  const isEdit = pathname.includes('/edit/')

  const basePath =
    pathname.split('/record_diagnosis')[0] + '/record_diagnosis'

  return (
    <div className="flex items-center gap-6">
      {/* LIST */}
      <button
        onClick={() => navigate(basePath)}
        className={`text-2xl font-bold ${
          isList ? 'text-blue-600' : 'text-dark-gray2'
        }`}
      >
        Revisiones
      </button>

      {/* NEW */}
      {record_file_id && !isEdit && (
        <button
          onClick={() =>
            navigate(`${basePath}/new_diagnosis/record_file/${record_file_id}`)
          }
          className={`text-2xl font-bold ${
            isNew ? 'text-blue-600' : 'text-dark-gray2'
          }`}
        >
          Nueva revisión
        </button>
      )}

      {/* EDIT */}
      {isEdit && (
        <span className="text-2xl font-bold text-blue-600">
          Editar revisión
        </span>
      )}
    </div>
  )
}


export default RecordDiagnosisHeader
