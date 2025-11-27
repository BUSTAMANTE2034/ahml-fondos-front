import { useRecordFiles } from "../../record-file-context"
import FilterText from "../components/filter-text"

const FilterPreviousReferenceCoden = () => {
  const { previous_reference_code, setPreviousReferenceCode } = useRecordFiles()

  return (
    <FilterText
      label="Código anterior"
      value={previous_reference_code}
      onChange={setPreviousReferenceCode}
    />
  )
}

export default FilterPreviousReferenceCoden
