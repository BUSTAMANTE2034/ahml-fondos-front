import { useRecordDiagnosis} from "./record-diagnosis-context"
import FilterText from "../../record-files/index/filters/components/filter-text"

const FilterDetail = () => {
  const { diagnosisDetail, setDiagnosisDetail} = useRecordDiagnosis()
  return (
    <FilterText
      label="Detalle Diagnóstico"
      value={diagnosisDetail}
      onChange={setDiagnosisDetail}
    />
  )
}

export default FilterDetail
