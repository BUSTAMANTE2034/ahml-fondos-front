import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'
import ActiveFilter from './record-file-active-filter'
import { useRecordFiles } from './record-file-context'
import DateFilter from './record-file-date-filter'
import SingleDatePicker from '@/components/ui/dataPiker'

const RecordFilesFilter = () => {
  const {

  } = useRecordFiles()

  return (
    <div className="flex flex-row justify-between items-center ">
      <span
        className={`${
          true ? 'text-tblack  font-semibold' : 'text-dark-gray2 '
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
        <p></p>
        {/* <ActiveFilter is_active={is_active} setIsActive={setIsActive} /> */}

        {/* FILTER FECHAS */}
        {/* <DateFilter
          start_date={start_date}
          end_date={end_date}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        /> */}
        {/* <SingleDatePicker
          label='Fecha inicio'
          value={start_date}
          onChange={setStartDate}
        />
        <SingleDatePicker
          label='Fecha fin'
          value={end_date}
          onChange={setEndDate}
        /> */}
      </MenuDesplegable>
    </div>
  )
}

export default RecordFilesFilter
