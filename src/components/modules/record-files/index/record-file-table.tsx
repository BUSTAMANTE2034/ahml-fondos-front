import { RecordFilesProvider, useRecordFiles } from './record-file-context'
import RecordFileFilter from './record-file-filter'
import SearchRecordFile from './record-file-search'
import RecordFilesPaginator from './record-file-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import RecordFileRow from './record-file-row'
import CreateRecordFileModal from '../modals/create-record-file-modal'
import UpdateRecordFileModal from '../modals/edit-record-file-modal'
import DeleteRecordFileModal from '../modals/delete-record-file-modal'
import ShowRecordFileModal from '../modals/show-record-file-modal'
import EnableRecordFileModal from '../modals/enable-record-file-modal'
import DisableRecordFileModal from '../modals/disable-record-file-modal'
import GetRecordFileCoverModal from '../modals/get-record-file-cover-modal'

const Table = () => {
  const {
    recordFiles,
    loadingGet,
    errorGet,openCreate
  } = useRecordFiles()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Expedientes
          </h2>

          <RecordFileFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchRecordFile />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.2fr]  md:grid-cols-[1fr_0.3fr_0.2fr_0.2fr_0.2fr_0.2fr_0.3fr_0.3fr_0.3fr_0.3fr_0.2fr] px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="hidden lg:block">Código</span>
        <span className="">Exp.</span>
        <span className="">Caja</span>
        <span className='hidden lg:block'>Fondo</span>
        <span className=''>Sección</span>
        <span className=''>Serie</span>
         <span className="">Delicado</span>
        <span className="">Estatus</span>
        <span className="">Fecha</span>
        
        <span className="">Ubicación</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las claves.'}
          </div>
        ) : recordFiles.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {recordFiles.map((recordFile) => (
               <RecordFileRow key={recordFile.id} item={recordFile}/>
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
        <RecordFilesPaginator />
      )}
      <CreateRecordFileModal/><UpdateRecordFileModal/><DeleteRecordFileModal/>
      <GetRecordFileCoverModal/>
      {/* 
      
      <EnableRecordFileModal/>
      <DisableRecordFileModal/>
      */} <ShowRecordFileModal/>

    </Card>
  )
}

const RecordFilesTable = () => {
  return (
    <RecordFilesProvider>
      <Table/>
    </RecordFilesProvider>
  )
}

export default RecordFilesTable
