import { DiagnosisCatalogProvider, useDiagnosisCatalog } from './catalog_diagnosis-context'
import DiagnosisCatalogFilter from './catalog_diagnosis-filter'
import SearchDiagnosisCatalog from './catalog_diagnosis-search'
import DiagnosisCatalogPaginator from './catalog_diagnosis-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import DiagnosisCatalogRow from './catalog_diagnosis-row'
import CreateDiagnosisCatalogModal from '../modals/create-catalog_diagnosis-modal'
import UpdateDiagnosisCatalogModal from '../modals/edit-catalog_diagnosis-modal'
import DeleteDiagnosisCatalogModal from '../modals/delete-catalog_diagnosis-modal'
import ShowDiagnosisCatalogModal from '../modals/show-catalog_diagnosis-modal'
import EnableDiagnosisCatalogModal from '../modals/enable-catalog_diagnosis-modal'
import DisableDiagnosisCatalogModal from '../modals/disable-catalog_diagnosis-modal'

const Table = () => {
  const {
    diagnosisCatalog,
    loadingGet,
    errorGet,openCreate
  } = useDiagnosisCatalog()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Catálogo de Diagnósticos
          </h2>

          <DiagnosisCatalogFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchDiagnosisCatalog />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[0.6fr_0.6fr_1.6fr_0.2fr]  md:grid-cols-[0.4fr_0.8fr_1.8fr_0.4fr_0.2fr] px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="hidden lg:block">Concepto</span>
        <span className="">Detalle</span>
        <span className='hidden lg:block'>Descripción</span>
        <span className=''>Fecha Actualización</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener los diagnósticos.'}
          </div>
        ) : diagnosisCatalog.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {diagnosisCatalog.map((fund) => (
               <DiagnosisCatalogRow key={fund.id} item={fund}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay diagnósticos para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && diagnosisCatalog.length > 0 && (
        <DiagnosisCatalogPaginator />
      )}
      <CreateDiagnosisCatalogModal/>
      <UpdateDiagnosisCatalogModal/>
      <DeleteDiagnosisCatalogModal/>
      <EnableDiagnosisCatalogModal/>
      <DisableDiagnosisCatalogModal/>
      <ShowDiagnosisCatalogModal/>

    </Card>
  )
}

const DiagnosisCatalogTable = () => {
  return (
    <DiagnosisCatalogProvider>
      <Table/>
    </DiagnosisCatalogProvider>
  )
}

export default DiagnosisCatalogTable
