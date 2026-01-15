import { PhysicalLocationsProvider, usePhysicalLocations } from './physical_location-context'
import PhysicalLocationFilter from './physical_location-filter'
import SearchPhysicalLocation from './physical_location-search'
import PhysicalLocationsPaginator from './physical_location-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import PhysicalLocationRow from './physical_location-row'
import CreatePhysicalLocationModal from '../modals/create-physical_location-modal'
import UpdatePhysicalLocationModal from '../modals/edit-physical_location-modal'
import DeletePhysicalLocationModal from '../modals/delete-physical_location-modal'
import ShowPhysicalLocationModal from '../modals/show-physical_location-modal'
import EnablePhysicalLocationModal from '../modals/enable-physical_location-modal'
import DisablePhysicalLocationModal from '../modals/disable-physical_location-modal'
import GetPhysicalLocationLabelModal from '../modals/get-record-file-cover-modal'
import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
const Table = () => {
    const { code } = useParams<{ code?: string }>()

  const {
    physicalLocations,
    loadingGet,
    errorGet,openCreate,openShow
  } = usePhysicalLocations()
// useEffect(() => {
//   if (!code || physicalLocations.length === 0) return

//   const found = physicalLocations.find(pl => pl.code === code)

//   if (found) {
//     openShow(found, true) // 👈 fromUrl = true
//   }
// }, [code, physicalLocations])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Ubicaciones Físicas
          </h2>

          <PhysicalLocationFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchPhysicalLocation/>
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[0.4fr_0.4fr_0.4fr_0.2fr]  md:grid-cols-[0.4fr_0.4fr_0.4fr_0.4fr_0.2fr]  px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="">Nombre</span>
        <span className="">Descripción</span>
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
        ) : physicalLocations.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {physicalLocations.map((typology) => (
               <PhysicalLocationRow key={typology.id} item={typology}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay ubicaciones físicas para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && physicalLocations.length > 0 && (
        <PhysicalLocationsPaginator />
      )}
      <CreatePhysicalLocationModal/>
      <UpdatePhysicalLocationModal/>
      <DeletePhysicalLocationModal/>
      <EnablePhysicalLocationModal/>
      <DisablePhysicalLocationModal/>
      <ShowPhysicalLocationModal/>
      <GetPhysicalLocationLabelModal/>

    </Card>
  )
}

const PhysicalLocationsTable = () => {
  return (
    <PhysicalLocationsProvider>
      <Table/>
    </PhysicalLocationsProvider>
  )
}

export default PhysicalLocationsTable
