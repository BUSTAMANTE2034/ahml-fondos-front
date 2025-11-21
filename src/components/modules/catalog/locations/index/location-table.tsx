import { LocationsProvider, useLocations } from './location-context'
import LocationFilter from './location-filter'
import SearchLocation from './location-search'
import LocationsPaginator from './location-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import LocationRow from './location-row'
import CreateLocationModal from '../modals/create-location-modal'
import UpdateLocationModal from '../modals/edit-location-modal'
import DeleteLocationModal from '../modals/delete-location-modal'
import ShowLocationModal from '../modals/show-location-modal'
import EnableLocationModal from '../modals/enable-location-modal'
import DisableLocationModal from '../modals/disable-location-modal'

const Table = () => {
  const {
    locations,
    loadingGet,
    errorGet,openCreate
  } = useLocations()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Ubicaciones
          </h2>

          <LocationFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchLocation />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[1.2fr_0.4fr_0.4fr_0.2fr]  md:grid-cols-[1.2fr_0.4fr_0.4fr_0.2fr]  px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="">Nombre</span>
        <span className="">Estatus</span>
        <span className="">Última actualización</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las claves.'}
          </div>
        ) : locations.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {locations.map((typology) => (
               <LocationRow key={typology.id} item={typology}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay ubicaciones para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && locations.length > 0 && (
        <LocationsPaginator />
      )}
      <CreateLocationModal/>
      <UpdateLocationModal/>
      <DeleteLocationModal/>
      <EnableLocationModal/>
      <DisableLocationModal/>
      <ShowLocationModal/>

    </Card>
  )
}

const LocationsTable = () => {
  return (
    <LocationsProvider>
      <Table/>
    </LocationsProvider>
  )
}

export default LocationsTable
