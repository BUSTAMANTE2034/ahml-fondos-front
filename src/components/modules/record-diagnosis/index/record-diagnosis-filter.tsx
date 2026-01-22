import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'
import { useRecordDiagnosis } from './record-diagnosis-context'
import SingleDatePicker from '@/components/ui/dataPiker'
import FilterDetail from './record-diagnosis-detail-filter'

const RecordDiagnosisFilter = () => {
  const { start_date, end_date, setStartDate, setEndDate } =
    useRecordDiagnosis()

  const hasFilters = Boolean(start_date || end_date)

  return (
    <div className="flex flex-row justify-between items-center">
      <span
        className={`${
          hasFilters ? 'text-tblack font-semibold' : 'text-dark-gray2'
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable
        className="w-65"
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
        <FilterDetail />

        {/* FECHA INICIO */}
        <SingleDatePicker
          label="Fecha inicio"
          value={start_date}
          onChange={setStartDate}
        />

        {/* FECHA FIN */}
        <SingleDatePicker
          label="Fecha fin"
          value={end_date}
          onChange={setEndDate}
        />
      </MenuDesplegable>
    </div>
  )
}

export default RecordDiagnosisFilter
