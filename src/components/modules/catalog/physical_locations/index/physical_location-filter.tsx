import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'
import ActiveFilter from './physical_location-active-filter'
import { usePhysicalLocations } from './physical_location-context'

const PhysicalLocationFilter = () => {
  const {
    is_active,
    setIsActive,

  } = usePhysicalLocations()

  return (
    <div className="flex flex-row justify-between items-center ">
      <span
        className={`${
          is_active? 'text-tblack  font-semibold' : 'text-dark-gray2 '
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
        <ActiveFilter is_active={is_active} setIsActive={setIsActive} />
       
      </MenuDesplegable>
    </div>
  )
}

export default PhysicalLocationFilter
