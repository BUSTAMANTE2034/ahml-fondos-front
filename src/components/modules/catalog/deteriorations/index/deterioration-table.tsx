import { DeteriorationsProvider, useDeteriorations } from './deterioration-context'
import DeteriorationFilter from './deterioration-filter'
import SearchDeterioration from './deterioration-search'
import DeteriorationsPaginator from './deterioration-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import DeteriorationRow from './deterioration-row'
import CreateDeteriorationModal from '../modals/create-deterioration-modal'
import UpdateDeteriorationModal from '../modals/edit-deterioration-modal'
import DeleteDeteriorationModal from '../modals/delete-deterioration-modal'
import ShowDeteriorationModal from '../modals/show-deterioration-modal'
import EnableDeteriorationModal from '../modals/enable-deterioration-modal'
import DisableDeteriorationModal from '../modals/disable-deterioration-modal'

const Table = () => {
  const {
    deteriorations,
    loadingGet,
    errorGet,openCreate
  } = useDeteriorations()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Deterioros
          </h2>

          <DeteriorationFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchDeterioration />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[1.4fr_3fr_0.2fr]  md:grid-cols-[1.4fr_3fr_0.2fr] px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="">Nombre</span>
        <span className="">Descripción</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las claves.'}
          </div>
        ) : deteriorations.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {deteriorations.map((deterioration) => (
               <DeteriorationRow key={deterioration.id} item={deterioration}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay deterioros para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && deteriorations.length > 0 && (
        <DeteriorationsPaginator />
      )}
      <CreateDeteriorationModal/>
      <UpdateDeteriorationModal/>
      <DeleteDeteriorationModal/>
      <EnableDeteriorationModal/>
      <DisableDeteriorationModal/>
      <ShowDeteriorationModal/>

    </Card>
  )
}

const DeteriorationsTable = () => {
  return (
    <DeteriorationsProvider>
      <Table/>
    </DeteriorationsProvider>
  )
}

export default DeteriorationsTable
