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
import ReorderRecordFilesModal from '../modals/reorder-record-file-modal'
import {
  RecordFileFilter,
  RecordFileFilterRow,
  RecordFileOrderFilter,
} from './filters'
import ExportRecordFilesExcelModal from '../modals/export-record_files-excel-modal'
import { recordFileGrid } from '@/components/ui/functions'
const Table = () => {
  const {
    recordFiles,
    loadingGet,
    errorGet,
    openCreate,
    openExportExcel,
    openReorder,
  } = useRecordFiles()

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
        className={`${recordFileGrid}
    pb-1 w-full items-center border-b-2 border-main-blue 
    font-semibold text-sm md:text-base  `}
      >
        {/* Código */}
        <span className=''>Código</span>

        {/* Exp. */}
          <span className="hidden md:block">Exp.</span>

        {/* Caja */}
          <span className="hidden md:block">Caja</span>

        {/* Fondo */}
          <span className="hidden md:block">Fondo</span>

        {/* Sección */}
          <span className="hidden md:block">Sección</span>

        {/* Serie */}
          <span className="hidden md:block">Serie</span>

        {/* Estado (sensible/normal) */}

        <span className="hidden lg:block  ">Estado</span>

        {/* Estatus */}
        <span>Estatus</span>

        {/* Fecha */}
        <span>Fecha</span>

        {/* Localidad */}

        <span className="hidden lg:block">Localidad</span>

        {/* Usuario */}
          <span className="hidden md:block">Usuario</span>

        {/* Columna menú */}
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
          <button
            onClick={openReorder}
            className="create text-sm! w-20!  font-semibold! h-8 "
          >
            <span className="text-sm!">Ordenar</span>
          </button>{' '}
          <RecordFilesPaginator />
          <button
            onClick={openExportExcel}
            className="create text-sm! w-20!  font-semibold! h-8 "
          >
            <span className="text-sm!">Exportar</span>
          </button>
        </div>
      )}
      <CreateRecordFileModal />
      <UpdateRecordFileModal />
      <DeleteRecordFileModal />
      <GetRecordFileCoverModal />
      <ExportRecordFilesExcelModal />
      <CreateLoanModal />
      <ReceiveLoanModal />
      <CreateMovementModal />
      <ShowRecordFileModal />
      <ReorderRecordFilesModal />
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
