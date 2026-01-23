import { useRecordFiles } from "../../record-file-context"
import FilterText from "../components/filter-text"

const FilterUserQuery= () => {
  const { user_query, setUserQuery } = useRecordFiles()

  return (
    <FilterText
      label="Usuario creador"
      value={user_query}
      onChange={setUserQuery}
    />
  )
}

export default FilterUserQuery
