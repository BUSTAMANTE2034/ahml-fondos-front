import { LoansProvider, useLoans } from './loan-context'
import LoanFilter from './loan-filter'
import SearchLoan from './loan-search'
import LoansPaginator from './loan-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import LoanRow from './loan-row'
import UpdateLoanModal from '../modals/edit-loan-modal'
import DeleteLoanModal from '../modals/delete-loan-modal'
import ShowLoanModal from '../modals/show-loan-modal'
import { useNavigate,useLocation } from 'react-router-dom'
import ReceiveLoanModal from '../modals/recibe-loan-modal'

const Table = () => {
  const {
    loans,
    loadingGet,
    errorGet,openCreate
  } = useLoans()
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
            Préstamos
          </h2>

          <LoanFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchLoan />
          <button onClick={goRecordFiles} className="create">
            <span>Nuevo</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[0.6fr_0.6fr_0.6fr_0.2fr]  md:grid-cols-[0.6fr_0.6fr_0.4fr_0.6fr_0.4fr_0.2fr] px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="hidden lg:block">Expediente</span>
        <span className="">Prestó</span> 
        <span className=''>Fecha Prestamo</span>
        <span className='hidden lg:block'>Recibió</span>
       
        <span className=''>Fecha Recibido</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las claves.'}
          </div>
        ) : loans.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {loans.map((loan) => (
               <LoanRow key={loan.id} item={loan}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay préstamos para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && loans.length > 0 && (
        <LoansPaginator />
      )}
      <UpdateLoanModal/>
      {/* <DeleteLoanModal/> */}
      <ReceiveLoanModal/>
      <ShowLoanModal/>

    </Card>
  )
}

const LoansTable = () => {
  return (
    <LoansProvider>
      <Table/>
    </LoansProvider>
  )
}

export default LoansTable
