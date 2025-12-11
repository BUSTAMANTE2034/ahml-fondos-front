import { RecordFilesProvider, useRecordFiles } from './record-file-context'
import RecordFilesFilter from './filters/filter'
import SearchRecordFile from './record-file-search'
import RecordFilesPaginator from './record-file-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import RecordFileRow from './record-file-row'
import CreateRecordFileModal from '../modals/create-record-file-modal'
import UpdateRecordFileModal from '../modals/edit-record-file-modal'
import DeleteRecordFileModal from '../modals/delete-record-file-modal'
import ShowRecordFileModal from '../modals/show-record-file-modal'

import GetRecordFileCoverModal from '../modals/get-record-file-cover-modal'
import CreateLoanModal from '../modals/create-loan-modal'
import ReceiveLoanModal from '../modals/recibe-loan-modal'
import CreateMovementModal from '../modals/create-movement-modal'
import {
  RecordFileFilter,
  RecordFileFilterRow,
  RecordFileOrderFilter,
} from './filters'
import ExportRecordFilesExcelModal from '../modals/export-record_files-excel-modal'
const Table = () => {
  const { recordFiles, loadingGet, errorGet, openCreate,openExportExcel } = useRecordFiles()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Expedientes
          </h2>

          <RecordFileOrderFilter />
          <RecordFileFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchRecordFile />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>
      <div
        className="grid gap-1  
  grid-cols-[1.6fr_0.6fr_0.6fr_0.2fr]
  md:grid-cols-[1fr_0.3fr_0.2fr_0.2fr_0.2fr_0.2fr_0.3fr_0.3fr_0.2fr]
  lg:grid-cols-[1fr_0.3fr_0.2fr_0.2fr_0.2fr_0.2fr_0.3fr_0.3fr_0.3fr_0.3fr_0.2fr]
  px-2 pb-1 w-full items-center border-b-2 border-main-blue 
  font-semibold text-sm md:text-base text-left"
      >
        {/* THEAD */}
        <span>Código</span>
        <span className="hidden md:block">Exp.</span>
        <span className="hidden md:block">Caja</span>
        <span className="hidden md:block">Fondo</span>
        <span className="hidden md:block">Sección</span>
        <span className="hidden md:block">Serie</span>
        <span className="hidden lg:block">Estado</span>
        <span>Estatus</span>
        <span>Fecha</span>
        <span className="hidden lg:block">Lugar</span>
        <span></span>

        {/* FILA DE FILTROS */}
        <div className="contents">
          <RecordFileFilterRow />
        </div>
      </div>

      {/* FILTER ROW NUEVO */}
      <CardBody>
        {loadingGet ? (
          <div className="flex w-full h-full items-start">
            <Loader label="Cargando..." size={50} />
          </div>
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet || 'Error al obtener las claves.'}
          </div>
        ) : recordFiles.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {recordFiles.map((recordFile) => (
                <RecordFileRow key={recordFile.id} item={recordFile} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay expedientes para mostrar.
          </div>
        )}
      </CardBody>
      {!loadingGet && !errorGet && recordFiles.length > 0 && (
        <div className="flex  flex-row items-center w-full justify-between">
          <span></span> <RecordFilesPaginator />
          <button onClick={openExportExcel} className="create text-sm! w-20!  font-semibold! h-8 ">
            <span className='text-sm!'>Exportar</span>
          </button>
        </div>
      )}
      <CreateRecordFileModal />
      <UpdateRecordFileModal />
      <DeleteRecordFileModal />
      <GetRecordFileCoverModal />
      <ExportRecordFilesExcelModal/>
      <CreateLoanModal/>
      <ReceiveLoanModal/>
      <CreateMovementModal/>
      <ShowRecordFileModal />
    </Card>
  )
}

const RecordFilesTable = () => {
  return (
    <RecordFilesProvider>
      
      <Table />
    </RecordFilesProvider>
  )
}

export default RecordFilesTable
