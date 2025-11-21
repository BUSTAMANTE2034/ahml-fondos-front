import { ManagersProvider, useManagers } from './manager-context'
import ManagerFilter from './manager-filter'
import SearchManager from './manager-search'
import ManagersPaginator from './manager-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import ManagerRow from './manager-row'
import CreateManagerModal from '../modals/create-manager-modal'
import UpdateManagerModal from '../modals/edit-managermodal'
import DeleteManagerModal from '../modals/delete-manager-modal'
import ShowManagerModal from '../modals/show-manager-modal'
import EnableManagerModal from '../modals/enable-manager-modal'
import DisableManagerModal from '../modals/disable-manager-modal'
import RecoverPasswordModal from '../modals/recover-password-manager-modal'

const Table = () => {
  const {
    managers,
    loadingGet,
    errorGet,openCreate
  } = useManagers()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Gestores
          </h2>

          <ManagerFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchManager />
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
        ) : managers.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {managers.map((manager) => (
               <ManagerRow key={manager.id} manager={manager}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay gestores para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && managers.length > 0 && (
        <ManagersPaginator />
      )}
      <CreateManagerModal/>
      <UpdateManagerModal/>
      <DeleteManagerModal/>
      <EnableManagerModal/>
      <DisableManagerModal/>
      <ShowManagerModal/>
<RecoverPasswordModal/>
    </Card>
  )
}

const ManagersTable = () => {
  return (
    <ManagersProvider>
      <Table />
    </ManagersProvider>
  )
}

export default ManagersTable
