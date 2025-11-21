import { SeriesProvider, useSeries } from './series-context'
import SeriesFilter from './series-filter'
import SearchSeries from './series-search'
import SeriessPaginator from './series-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import SeriesRow from './series-row'
import CreateSeriesModal from '../modals/create-series-modal'
import UpdateSeriesModal from '../modals/edit-series-modal'
import DeleteSeriesModal from '../modals/delete-series-modal'
import ShowSeriesModal from '../modals/show-series-modal'
import EnableSeriesModal from '../modals/enable-series-modal'
import DisableSeriesModal from '../modals/disable-series-modal'

const Table = () => {
  const {
    series,
    loadingGet,
    errorGet,openCreate
  } = useSeries()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Series
          </h2>

          <SeriesFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchSeries />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.2fr]  md:grid-cols-[0.4fr_1.8fr_0.4fr_0.8fr_0.8fr_0.2fr] px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="hidden lg:block">Clave</span>
        <span className="">Nombre</span>
        <span className='hidden lg:block'>Acrónimo</span>
        <span className=''>Fecha Inicio</span>
        <span className=''>Fecha Fin</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las claves.'}
          </div>
        ) : series.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {series.map((series) => (
               <SeriesRow key={series.id} item={series}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay series para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && series.length > 0 && (
        <SeriessPaginator />
      )}
      <CreateSeriesModal/>
      <UpdateSeriesModal/>
      <DeleteSeriesModal/>
      <EnableSeriesModal/>
      <DisableSeriesModal/>
      <ShowSeriesModal/>

    </Card>
  )
}

const SeriesTable = () => {
  return (
    <SeriesProvider>
      <Table/>
    </SeriesProvider>
  )
}

export default SeriesTable
