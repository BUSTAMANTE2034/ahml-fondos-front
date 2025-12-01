import { useRecordFiles } from "../../record-file-context"
import FilterText from "../components/filter-text"

const FilterDeterioration = () => {
  const { deterioration_name, setDeteriorationName } = useRecordFiles()

  return (
    <FilterText
      label="Deterioro"
      value={deterioration_name}
      onChange={setDeteriorationName}
    />
  )
}

export default FilterDeterioration
