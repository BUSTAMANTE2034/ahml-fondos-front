import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'
import ActiveFilter from './loan-active-filter'
import { useLoans } from './loan-context'
import SingleDatePicker from '@/components/ui/dataPiker'

const LoanFilter = () => {
  const {
    active,
    setActive,

    loadedAfter,
    loadedBefore,
    returnedAfter,
    returnedBefore,

    setLoadedAfter,
    setLoadedBefore,
    setReturnedAfter,
    setReturnedBefore,
  } = useLoans()

  // Detectar si hay filtros activos
  const anyFilterActive =
    active !== null ||
    loadedAfter ||
    loadedBefore ||
    returnedAfter ||
    returnedBefore

  return (
    <div className="flex flex-row justify-between items-center">
      <span
        className={`${
          anyFilterActive ? 'text-tblack font-semibold' : 'text-dark-gray2'
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable className='w-40'
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
        {/* ==== FILTRO ACTIVO / INACTIVO ==== */}
        <ActiveFilter is_active={active} setIsActive={setActive} />

        {/* ==== FILTROS DE FECHAS ==== */}
        <div className="w-full border-t border-gray-3 my-2"></div>

        {/* LOADED (salida del expediente) */}
        <SingleDatePicker
          label="Prestado desde"
          value={loadedAfter}
          onChange={setLoadedAfter}
        />
        <SingleDatePicker
          label="Prestado hasta"
          value={loadedBefore}
          onChange={setLoadedBefore}
          // min={loadedAfter ?? undefined}
          // disabled={!loadedAfter}
        />

        <div className="w-full border-t border-gray-3 my-2"></div>

        {/* RETURNED (devolución del expediente) */}
        <SingleDatePicker
          label="Devuelto desde"
          value={returnedAfter}
          onChange={setReturnedAfter}
        />
        <SingleDatePicker
          label="Devuelto hasta"
          value={returnedBefore}
          onChange={setReturnedBefore}
          // min={returnedAfter ?? undefined}
          // disabled={!returnedAfter}
        />
      </MenuDesplegable>
    </div>
  )
}

export default LoanFilter
