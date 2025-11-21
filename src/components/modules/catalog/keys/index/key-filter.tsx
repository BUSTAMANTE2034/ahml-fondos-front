import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'
import ActiveFilter from './key-active-filter'
import { useKeys } from './key-context'

const KeyFilter = () => {

  const { is_active,setIsActive,entity_type,setEntityType  } = useKeys()
  
  return (
    <div className="flex flex-row justify-between items-center ">
      <span
        className={`${
           is_active
            ? 'text-tblack  font-semibold'
            : 'text-dark-gray2 '
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable
        trigger={
          <img
            src={Filter}
            alt="menu"
            className="icon-size"
          />
        }
      >
        <ActiveFilter
          is_active={is_active}
          setIsActive={setIsActive}
          entity_type={entity_type}
          setEntityType={setEntityType}
        />
      </MenuDesplegable>
    </div>
  )
}

export default KeyFilter
