type DateFilterProps = {
  start_date: string | null
  end_date: string | null
  setStartDate: (v: string | null) => void
  setEndDate: (v: string | null) => void
}

const DateFilter = ({
  start_date,
  end_date,
  setStartDate,
  setEndDate
}: DateFilterProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">

      {/* FECHA INICIO */}
      <label className="flex flex-col text-xs ">
        <span className="font-semibold mb-1">Fecha Inicio</span>
        <input
          type="date"
          value={start_date ?? ""}
          onChange={(e) =>
            setStartDate(e.target.value !== "" ? e.target.value : null)
          }
          className="border border-gray-4 active:border-gray-4 focus:border-gray-4 rounded-3xl px-2 py-1 text-xs cursor-pointer hover:bg-gray-1 active:bg-gray-2"
        />
      </label>

      {/* FECHA FIN */}
      <label className="flex flex-col text-xs">
        <span className="font-semibold mb-1">Fecha Fin</span>
        <input
          type="date"
          value={end_date ?? ""}
          min={start_date ?? undefined}
          disabled={!start_date}
          onChange={(e) =>
            setEndDate(e.target.value !== "" ? e.target.value : null)
          }
          className="border border-gray-4 active:border-gray-4 focus:border-gray-4 rounded-3xl px-2 py-1 text-xs cursor-pointer hover:bg-gray-1 active:bg-gray-2"
        />
      </label>

    </div>
  )
}

export default DateFilter
