import { useRecordFiles } from "../../record-file-context"
import SingleDatePicker from "@/components/ui/dataPiker"

const FilterFileDate = () => {
  const {
    file_date_after,
    file_date_before,
    setFileDateAfter,
    setFileDateBefore,
  } = useRecordFiles()

  return (
    <div className="flex flex-col gap-2 mb-2">
      <p className="text-xs font-semibold">Fecha documental</p>

      <SingleDatePicker
        label="Desde"
        value={file_date_after}
        onChange={setFileDateAfter}
      />

      <SingleDatePicker
        label="Hasta"
        value={file_date_before}
        onChange={setFileDateBefore}
      />
    </div>
  )
}

export default FilterFileDate
