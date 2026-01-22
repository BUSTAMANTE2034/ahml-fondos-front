import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'


// filtros del menú


import FilterOrderSeries from './order'
import { useSeries } from './series-context'

const SeriesOrderFilter = () => {
  const { order_by, setOrderBy } = useSeries()

  const hasFilters = order_by !== null

  return (
    <div className="flex flex-row justify-between items-center">
      <span
        className={`${
          hasFilters ? "text-tblack font-semibold" : "text-dark-gray2"
        } text-xs md:text-sm`}
      >
        Orden
      </span>

      <MenuDesplegable
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
        <div className="flex flex-col gap-3 p-3 w-full">
          <FilterOrderSeries />

          {hasFilters && (
            <button
               onClick={() => setOrderBy(null)}
              className="
                w-full
                bg-gray-1 hover:bg-gray-2
                cursor-pointer active:bg-gray-3
                border border-gray-3
                text-xs font-semibold
                p-2 rounded-3xl mt-1
              "
            >
              Limpiar
            </button>
          )}
        </div>
      </MenuDesplegable>
    </div>
  )
}


export default SeriesOrderFilter
