import { KeysProvider, useKeys } from './key-context'
import KeyFilter from './key-filter'
import SearchKey from './key-search'
import KeysPaginator from './key-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import KeyRow from './key-row'
import CreateKeyModal from '../modals/create-key-modal'
import UpdateKeyModal from '../modals/edit-key-modal'
import DeleteKeyModal from '../modals/delete-key-modal'
import ShowKeyModal from '../modals/show-key-modal'
import EnableKeyModal from '../modals/enable-key-modal'
import DisableKeyModal from '../modals/disable-key-modal'

const Table = () => {
  const {
    keys,
    loadingGet,
    errorGet,openCreate
  } = useKeys()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Claves de Catálogo
          </h2>

          <KeyFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchKey />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[1.8fr_0.4fr_0.2fr] px-2  md:grid-cols-[2fr_0.4fr_0.4fr_0.2fr] w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className=" ">Nombre</span>
        <span className="hidden lg:block">Clave</span>
        <span>Entidad</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las claves.'}
          </div>
        ) : keys.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {keys.map((key) => (
               <KeyRow key={key.id} item={key}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay claves para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && keys.length > 0 && (
        <KeysPaginator />
      )}
      <CreateKeyModal/>
      <UpdateKeyModal/>
      <DeleteKeyModal/>
      <EnableKeyModal/>
      <DisableKeyModal/>
      <ShowKeyModal/>

    </Card>
  )
}

const KeysTable = () => {
  return (
    <KeysProvider>
      <Table/>
    </KeysProvider>
  )
}

export default KeysTable
