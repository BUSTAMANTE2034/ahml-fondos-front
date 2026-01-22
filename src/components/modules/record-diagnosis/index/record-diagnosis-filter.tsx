import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'
import { useRecordDiagnosis } from './record-diagnosis-context'
import SingleDatePicker from '@/components/ui/dataPiker'

const RecordDiagnosisFilter = () => {
  const {
    start_date,
    end_date,
    setStartDate,
    setEndDate,
  } = useRecordDiagnosis()

  const hasFilters = Boolean(start_date || end_date)

  return (
    <div className="flex flex-row justify-between items-center">
      <span
        className={`${
          hasFilters
            ? 'text-tblack font-semibold'
            : 'text-dark-gray2'
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
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
