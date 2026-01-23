import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'
import { useRecordFiles } from '../record-file-context'

// filtros del menú
import FilterDeterioration from './advanced/deterioration'
import FilterTypology from './advanced/typology'
import FilterFileDate from './advanced/file-date'
import FilterOrder from './advanced/order'
import FilterPreviousReferenceCoden from './advanced/previous_reference_code'
import FilterUserQuery from './advanced/user_query'

const RecordFilesFilter = () => {
  const {
    query,
    reference_code,
    file_number,
    box_number,

    sensitive,
    fund_name,
    section_name,
    series_name,
    location_name,
    deterioration_name,
    typology_name,

    availability_status,
    file_date_after,
    file_date_before,
    order_by,resetFilters
  } = useRecordFiles()

  const hasFilters =
    query.trim() !== "" ||
    reference_code.trim() !== "" ||
    file_number.trim() !== "" ||
    box_number.trim() !== "" ||
    sensitive !== "all" ||
    fund_name.trim() !== "" ||
    section_name.trim() !== "" ||
    series_name.trim() !== "" ||
    location_name.trim() !== "" ||
    deterioration_name.trim() !== "" ||
    typology_name.trim() !== "" ||
    availability_status !== "all" ||
    file_date_after !== null ||
    file_date_before !== null 
    // order_by !== null

  return (
    <div className="flex flex-row justify-between items-center">
      <span
        className={`${
          hasFilters ? "text-tblack font-semibold" : "text-dark-gray2"
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable className='w-50' 
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
        <div className="flex flex-col gap-3 p-3 w-full">
          {/* <FilterSensitive />
          <FilterAvailability /> */}
          <FilterUserQuery />
          <FilterDeterioration />
          <FilterTypology />  
          <FilterPreviousReferenceCoden/>
          <FilterFileDate />
        
          {/* <FilterOrder /> */}
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="w-full bg-gray-1 hover:bg-gray-2 cursor-pointer active:bg-gray-3 border border-gray-3 text-xs font-semibold p-2 rounded-3xl mt-1"
            >
              Limpiar
            </button>
          )}
        </div>
      </MenuDesplegable>
    </div>
  )
}

export default RecordFilesFilter
