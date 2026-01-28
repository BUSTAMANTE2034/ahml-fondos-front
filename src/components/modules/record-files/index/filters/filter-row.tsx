import { useRecordFiles } from '../record-file-context'
import { FilterDateInput } from './components/filter-date-input'
import { FilterRowInput } from './components/filter-row-input'
import { FilterSelect } from './components/filter-row-select'

const RecordFileFilterRow = () => {
  const {
    reference_code,
    setReferenceCode,
    file_number,
    setFileNumber,
    box_number,
    setBoxNumber,

    fund_name,
    setFundName,
    section_name,
    setSectionName,
    series_name,
    setSeriesName,
    location_name,
    setLocationName,
    user_query2,setUserQuery2,

    sensitive,
    setSensitive,
    availability_status,
    setAvailabilityStatus,

    file_date_after,
    setFileDateAfter,
    file_date,
    setFileDate,
  } = useRecordFiles()

  return (
    // <div className="
    //   grid grid-cols-[1.6fr_0.6fr_0.6fr_0.2fr]  md:grid-cols-[1fr_0.3fr_0.2fr_0.2fr_0.2fr_0.2fr_0.3fr_0.3fr_0.3fr_0.3fr_0.2fr]
    //    w-full items-center border-b bg-gray-0/40 gap-1
    // ">
    <>
      {/* reference_code */}
      <div className="">
        <FilterRowInput
          value={reference_code}
          placeholder="Código..."
          onChange={setReferenceCode}
        />
      </div>
      {/* file_number */}
      <div className="hidden md:block">
        <FilterRowInput
          value={file_number}
          placeholder="Exp..."
          onChange={setFileNumber}
        />
      </div>
      {/* box_number */}
      <div className="hidden md:block">
        <FilterRowInput
          value={box_number}
          placeholder="Caja..."
          onChange={setBoxNumber}
        />
      </div>
      
      {/* fund_name */}
      <div className="hidden md:block ">
        <FilterRowInput
          value={fund_name}
          placeholder="Fondo..."
          onChange={setFundName}
        />
      </div>
      {/* section_name */}
      <div className="hidden md:block">
        <FilterRowInput
          value={section_name}
          placeholder="Sección..."
          onChange={setSectionName}
        />
      </div>
      {/* series_name */}
      <div className="hidden md:block">
        <FilterRowInput
          value={series_name}
          placeholder="Serie..."
          onChange={setSeriesName}
        />
      </div>
      {/* sensitive */}
      <div className="hidden lg:block">
        <FilterSelect value={sensitive} onChange={setSensitive}>
          <option value="all">Todos</option>
          <option value="delicate">Delicado</option>
          <option value="not_delicate">Normal</option>
        </FilterSelect>
      </div>
      {/* availability */}
      <div className="">
        <FilterSelect
          value={availability_status}
          onChange={setAvailabilityStatus}
        >
          <option value="all">Todos</option>
          <option value="available">Disponible</option>
          <option value="on_loan">Prestado</option>
          <option value="under_review">En revisión</option>
          <option value="unavailable">No disponible</option>
        </FilterSelect>
      </div>
      {/* file_date_after */}
      <div className="">
        <FilterDateInput value={file_date} onChange={setFileDate} />
      </div>
      {/* location_name */}
      <div className="hidden lg:block">
        <FilterRowInput
          value={location_name}
          placeholder="Localidad..."
          onChange={setLocationName}
        />
      </div>
      {/* Usuario*/}
       <div className="hidden md:block ">
        <FilterRowInput
          value={user_query2}
          placeholder="Usuario..."
          onChange={setUserQuery2}
        />
      </div>
      <span></span>
    </>

    // </div>
  )
}

export default RecordFileFilterRow
