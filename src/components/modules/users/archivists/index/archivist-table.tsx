import { ArchivistsProvider, useArchivists } from './archivist-context'
import ArchivistFilter from './archivist-filter'
import SearchArchivist from './archivist-search'
import ArchivistsPaginator from './archivist-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import ArchivistRow from './archivist-row'
import CreateArchivistModal from '../modals/create-archivist-modal'
import UpdateArchivistModal from '../modals/edit-archivist-modal'
import DeleteArchivistModal from '../modals/delete-archivist-modal'
import ShowArchivistModal from '../modals/show-archivist-modal'
import EnableArchivistModal from '../modals/enable-archivist-modal'
import DisableArchivistModal from '../modals/disable-archivist-modal'
import RecoverPasswordModal from '../modals/recover-password-archivist-modal'
const Table = () => {
  const {
    archivists,
    loadingGet,
    errorGet,openCreate
  } = useArchivists()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Archivistas
          </h2>

          <ArchivistFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchArchivist />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[1fr_1fr_1.8fr_0.2fr] px-2  md:grid-cols-[1fr_1fr_1fr_1.8fr_1fr_0.2fr] w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="">Nombre</span>
        <span className="hidden lg:block">Apellido</span>
        <span>No.Empleado</span>
        <span>Correo</span>
        <span className='hidden md:block'>Último inicio</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener los usuarios.'}
          </div>
        ) : archivists.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {archivists.map((archivist) => (
               <ArchivistRow key={archivist.id} Archivist={archivist}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay archivistas para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && archivists.length > 0 && (
        <ArchivistsPaginator />
      )}
      <CreateArchivistModal/>
      <UpdateArchivistModal/>
      <DeleteArchivistModal/>
      <EnableArchivistModal/>
      <DisableArchivistModal/>
      <ShowArchivistModal/>
      <RecoverPasswordModal/>

    </Card>
  )
}

const ArchivistsTable = () => {
  return (
    <ArchivistsProvider>
      <Table />
    </ArchivistsProvider>
  )
}

export default ArchivistsTable
