import { FundsProvider, useFunds } from './fund-context'
import FundFilter from './fund-filter'
import SearchFund from './fund-search'
import FundsPaginator from './fund-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import FundRow from './fund-row'
import CreateFundModal from '../modals/create-fund-modal'
import UpdateFundModal from '../modals/edit-fund-modal'
import DeleteFundModal from '../modals/delete-fund-modal'
import ShowFundModal from '../modals/show-fund-modal'
import EnableFundModal from '../modals/enable-fund-modal'
import DisableFundModal from '../modals/disable-fund-modal'

const Table = () => {
  const {
    funds,
    loadingGet,
    errorGet,openCreate
  } = useFunds()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Fondos
          </h2>

          <FundFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchFund />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.2fr]  md:grid-cols-[0.4fr_1.8fr_0.4fr_0.8fr_0.8fr_0.2fr] px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="hidden lg:block">Clave</span>
        <span className="">Nombre</span>
        <span className='hidden lg:block'>Sigla</span>
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
        ) : funds.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {funds.map((fund) => (
               <FundRow key={fund.id} item={fund}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay fondos para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && funds.length > 0 && (
        <FundsPaginator />
      )}
      <CreateFundModal/>
      <UpdateFundModal/>
      <DeleteFundModal/>
      <EnableFundModal/>
      <DisableFundModal/>
      <ShowFundModal/>

    </Card>
  )
}

const FundsTable = () => {
  return (
    <FundsProvider>
      <Table/>
    </FundsProvider>
  )
}

export default FundsTable
