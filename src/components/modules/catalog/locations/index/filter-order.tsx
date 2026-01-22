import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'

import FilterOrderLocations from './order'
import { useLocations } from './location-context'

const LocationsOrderFilter = () => {
  const { order_by, setOrderBy } = useLocations()

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
          <FilterOrderLocations />

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

export default LocationsOrderFilter
