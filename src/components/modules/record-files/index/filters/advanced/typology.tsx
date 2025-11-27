import { useRecordFiles } from "../../record-file-context"
import FilterText from "../components/filter-text"

const FilterTypology = () => {
  const { typology_name, setTypologyName } = useRecordFiles()

  return (
    <FilterText
      label="Tipología"
      value={typology_name}
      onChange={setTypologyName}
    />
  )
}

export default FilterTypology
