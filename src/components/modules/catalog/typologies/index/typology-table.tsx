import { TypologiesProvider, useTypologies } from './typology-context'
import TypologyFilter from './typology-filter'
import SearchTypology from './typology-search'
import TypologysPaginator from './typology-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import TypologyRow from './typology-row'
import CreateTypologyModal from '../modals/create-typology-modal'
import UpdateTypologyModal from '../modals/edit-typology-modal'
import DeleteTypologyModal from '../modals/delete-typology-modal'
import ShowTypologyModal from '../modals/show-typology-modal'
import EnableTypologyModal from '../modals/enable-typology-modal'
import DisableTypologyModal from '../modals/disable-typology-modal'

const Table = () => {
  const {
    typologies,
    loadingGet,
    errorGet,openCreate
  } = useTypologies()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Tipologías
          </h2>

          <TypologyFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchTypology />
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
        ) : typologies.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {typologies.map((typology) => (
               <TypologyRow key={typology.id} item={typology}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay tipologías para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && typologies.length > 0 && (
        <TypologysPaginator />
      )}
      <CreateTypologyModal/>
      <UpdateTypologyModal/>
      <DeleteTypologyModal/>
      <EnableTypologyModal/>
      <DisableTypologyModal/>
      <ShowTypologyModal/>

    </Card>
  )
}

const TypologiesTable = () => {
  return (
    <TypologiesProvider>
      <Table/>
    </TypologiesProvider>
  )
}

export default TypologiesTable
