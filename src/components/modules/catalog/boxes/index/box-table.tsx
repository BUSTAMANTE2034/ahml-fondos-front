import { BoxesProvider, useBoxes } from './box-context'
import BoxFilter from './box-filter'
import SearchBox from './box-search'
import BoxsPaginator from './box-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import BoxRow from './box-row'
import CreateBoxModal from '../modals/create-box-modal'
import UpdateBoxModal from '../modals/edit-box-modal'
import DeleteBoxModal from '../modals/delete-box-modal'
import ShowBoxModal from '../modals/show-box-modal'
import EnableBoxModal from '../modals/enable-box-modal'
import DisableBoxModal from '../modals/disable-box-modal'
import BoxesOrderFilter from './filter-order'

const Table = () => {
  const {
    boxes,
    loadingGet,
    errorGet,openCreate
  } = useBoxes()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Cajas
          </h2>
<BoxesOrderFilter />
          <BoxFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchBox />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[0.4fr_0.4fr_0.4fr_0.2fr]  md:grid-cols-[0.4fr_0.4fr_0.4fr_0.4fr_0.2fr]  px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="">Número de caja</span>
        <span className="">Ubicación física</span>
        <span className="">Estatus</span>
        <span className="">Última actualización</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las cajas.'}
          </div>
        ) : boxes.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {boxes.map((typology) => (
               <BoxRow key={typology.id} item={typology}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay cajas para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && boxes.length > 0 && (
        <BoxsPaginator />
      )}
      <CreateBoxModal/>
      <UpdateBoxModal/>
      <DeleteBoxModal/>
      <EnableBoxModal/>
      <DisableBoxModal/>
      <ShowBoxModal/>

    </Card>
  )
}

const BoxsTable = () => {
  return (
    <BoxesProvider>
      <Table/>
    </BoxesProvider>
  )
}

export default BoxsTable
