import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'
import ActiveFilter from './deterioration-active-filter'
import { useDeteriorations } from './deterioration-context'

const DeteriorationFilter = () => {
  const {
    is_active,
    setIsActive,

  } = useDeteriorations()

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

export default DeteriorationFilter
