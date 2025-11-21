import { VisitorsProvider, useVisitors } from './visitor-context'
import VisitorFilter from './visitor-filter'
import SearchVisitor from './visitor-search'
import VisitorsPaginator from './visitor-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import VisitorRow from './visitor-row'
import CreateVisitorModal from '../modals/create-visitor-modal'
import UpdateVisitorModal from '../modals/edit-visitor-modal'
import DeleteVisitorModal from '../modals/delete-visitor-modal'
import ShowVisitorModal from '../modals/show-visitor-modal'
import EnableVisitorModal from '../modals/enable-visitor-modal'
import DisableVisitorModal from '../modals/disable-visitor-modal'
import RecoverPasswordModal from './recover-password-visitor-modal'
const Table = () => {
  const {
    visitors,
    loadingGet,
    errorGet,openCreate
  } = useVisitors()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Visitantes
          </h2>

          <VisitorFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchVisitor />
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
        ) : visitors.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {visitors.map((visitor) => (
               <VisitorRow key={visitor.id} visitor={visitor}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay visitantes para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && visitors.length > 0 && (
        <VisitorsPaginator />
      )}
      <CreateVisitorModal/>
      <UpdateVisitorModal/>
      <DeleteVisitorModal/>
      <EnableVisitorModal/>
      <DisableVisitorModal/>
      <ShowVisitorModal/>
      <RecoverPasswordModal/>

    </Card>
  )
}

const VisitorsTable = () => {
  return (
    <VisitorsProvider>
      <Table />
    </VisitorsProvider>
  )
}

export default VisitorsTable
