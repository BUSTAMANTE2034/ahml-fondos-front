import { MovementsProvider, useMovements } from './movement-context'
import MovementFilter from './movement-filter'
import SearchMovement from './movement-search'
import MovementsPaginator from './movement-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import MovementRow from './movement-row'
import UpdateMovementModal from '../modals/edit-movement-modal'
import DeleteMovementModal from '../modals/delete-movement-modal'
import ShowMovementModal from '../modals/show-movement-modal'
import { useNavigate,useLocation } from 'react-router-dom'

const Table = () => {
  const {
    movements,
    loadingGet,
    errorGet,openCreate
  } = useMovements()
const navigate = useNavigate();
  const location = useLocation();

  const goRecordFiles = () => {
    const parts = location.pathname.split("/");
    parts[parts.length - 1] = "record-files"; // reemplaza el último segmento

    const newPath = parts.join("/");
    navigate(newPath);
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Movimientos
          </h2>

          <MovementFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchMovement />
          <button onClick={goRecordFiles} className="create">
            <span>Nuevo</span>
          </button>
        </div>
      </CardHeader>

    <div className="
  g grid grid-cols-[0.7fr_0.6fr_0.6fr_0.6fr_0.2fr]
        md:grid-cols-[0.6fr_0.6fr_0.4fr_0.4fr_0.4fr_0.2fr]
  border-b-2 border-main-blue 
  font-semibold text-sm md:text-base text-left
">
  {/* Expediente */}
  <span className="hidden lg:block">Expediente</span>

  {/* Origin */}
  <span className="">Origen</span>

  {/* Destination */}
  <span className="">Destino</span>

  {/* Fecha del movimiento */}
  <span className="">Movimiento</span>

  {/* Usuario */}
  <span className="hidden lg:block">Usuario</span>

  {/* Empty for actions */}
  <span></span>
</div>


      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las claves.'}
          </div>
        ) : movements.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {movements.map((movement) => (
               <MovementRow key={movement.id} item={movement}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay movimientos para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && movements.length > 0 && (
        <MovementsPaginator />
      )}
      <UpdateMovementModal/>
      <DeleteMovementModal/>
      <ShowMovementModal/>

    </Card>
  )
}

const MovementsTable = () => {
  return (
    <MovementsProvider>
      <Table/>
    </MovementsProvider>
  )
}

export default MovementsTable
