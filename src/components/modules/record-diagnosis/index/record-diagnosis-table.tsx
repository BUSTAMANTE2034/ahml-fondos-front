import { useLocation, useNavigate, useParams } from 'react-router-dom'
import RecordDiagnosisHeader from './record-diagnosis-header'
import RecordDiagnosisFilter from './record-diagnosis-filter'
import SearchRecordDiagnosis from './record-diagnosis-search'
import RecordDiagnosisPaginator from './record-diagnosis-paginator'
import RecordDiagnosisRow from './record-diagnosis-row'
import CreateRecordDiagnosisView from '../modals/create-record-diagnosis-view'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'

import {
  useRecordDiagnosis,
  RecordDiagnosisProvider,
} from './record-diagnosis-context'
import { RecordFilesProvider } from '../../record-files/index/record-file-context'
import ShowRecordDiagnosisModal from '../modals/show-record-diagnosis-modal'
import EditRecordDiagnosisView from '../modals/edit-record-diagnosis-modal'
import EditRecordDiagnosisModal from '../modals/edit-record-diagnosis-modal'
import DeleteRecordDiagnosisModal from '../modals/delete-record-diagnosis-modal'

const RecordDiagnosisView = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { recordDiagnoses, loadingGet, errorGet } = useRecordDiagnosis()

  const pathname = location.pathname
  const {
  record_file_id,
  record_diagnosis_id,
} = useParams<{
  record_file_id?: string
  record_diagnosis_id?: string
}>()

const isCreate = Boolean(record_file_id)
const isEdit = Boolean(record_diagnosis_id)
const isList = !isCreate && !isEdit
  // 👉 base dinámica, como antes pero bien
  const basePath = location.pathname.split('/record_diagnosis')[0]

  const goRecordFiles = () => {
    navigate(`${basePath}/record-files`)
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4">
        <RecordDiagnosisHeader />

        {isList && (
          <>
            <div className="flex justify-between items-center">
              <SearchRecordDiagnosis />
              <button onClick={goRecordFiles} className="create">
                <span>Agregar</span>
              </button>
            </div>

            <RecordDiagnosisFilter />
          </>
        )}
      </CardHeader>
      <div className="grid grid-cols-[0.7fr_0.7fr_0.7fr_0.2fr]  md:grid-cols-[0.7fr_0.6fr_1.6fr_0.6fr_0.2fr] px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="">Expediente</span>
        <span className="">Actualización Exp.</span>
        <span className='hidden lg:block'>Obervaciones</span>
        <span className=''>Fecha Revisión</span>
        <span></span>
      </div>


      <CardBody>
  {isCreate && <CreateRecordDiagnosisView />}



  {isList && (
    <>
      {loadingGet ? (
        <Loader />
      ) : errorGet ? (
        <div className="text-red-500">{errorGet}</div>
      ) : recordDiagnoses.length ? (
        recordDiagnoses.map((r) => (
          <RecordDiagnosisRow key={r.id} item={r} />
        ))
      ) : (
        <div className='flex flex-col items-center text-dark2-gray'>No hay revisiones</div>
      )}
    </>
  )}
</CardBody>


      <ShowRecordDiagnosisModal />
      <EditRecordDiagnosisModal/>
      <DeleteRecordDiagnosisModal />
      <RecordDiagnosisPaginator />
    </Card>
  )
}

const RecordDiagnosisPage = () => (
  <RecordFilesProvider>
    <RecordDiagnosisProvider>
      <RecordDiagnosisView />
    </RecordDiagnosisProvider>
  </RecordFilesProvider>
)

export default RecordDiagnosisPage
