type DateFilterLoansProps = {
  loadedAfter: string | null
  loadedBefore: string | null
  returnedAfter: string | null
  returnedBefore: string | null

  setLoadedAfter: (v: string | null) => void
  setLoadedBefore: (v: string | null) => void
  setReturnedAfter: (v: string | null) => void
  setReturnedBefore: (v: string | null) => void
}

const DateFilterLoans = ({
  loadedAfter,
  loadedBefore,
  returnedAfter,
  returnedBefore,

  setLoadedAfter,
  setLoadedBefore,
  setReturnedAfter,
  setReturnedBefore,
}: DateFilterLoansProps) => {
  return (
    <div className="flex flex-col gap-4 w-full">

      {/* ====================== */}
      {/* FECHAS DE SALIDA (loaded_at) */}
      {/* ====================== */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-700">Fecha de salida</span>

        {/* Loaded After */}
        <label className="flex flex-col text-xs">
          <span className="mb-1">Desde</span>
          <input
            type="date"
            value={loadedAfter ?? ""}
            onChange={(e) =>
              setLoadedAfter(e.target.value !== "" ? e.target.value : null)
            }
            className="border border-gray-4 rounded-3xl px-2 py-1 text-xs cursor-pointer 
                       hover:bg-gray-1 active:bg-gray-2"
          />
        </label>

        {/* Loaded Before */}
        <label className="flex flex-col text-xs">
          <span className="mb-1">Hasta</span>
          <input
            type="date"
            value={loadedBefore ?? ""}
            min={loadedAfter ?? undefined}
            disabled={!loadedAfter}
            onChange={(e) =>
              setLoadedBefore(e.target.value !== "" ? e.target.value : null)
            }
            className="border border-gray-4 rounded-3xl px-2 py-1 text-xs cursor-pointer 
                       hover:bg-gray-1 active:bg-gray-2 disabled:opacity-40"
          />
        </label>
      </div>

      {/* ====================== */}
      {/* FECHAS DE DEVOLUCIÓN (returned_at) */}
      {/* ====================== */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-gray-700">Fecha de devolución</span>

        {/* Returned After */}
        <label className="flex flex-col text-xs">
          <span className="mb-1">Desde</span>
          <input
            type="date"
            value={returnedAfter ?? ""}
            onChange={(e) =>
              setReturnedAfter(e.target.value !== "" ? e.target.value : null)
            }
            className="border border-gray-4 rounded-3xl px-2 py-1 text-xs cursor-pointer 
                       hover:bg-gray-1 active:bg-gray-2"
          />
        </label>

        {/* Returned Before */}
        <label className="flex flex-col text-xs">
          <span className="mb-1">Hasta</span>
          <input
            type="date"
            value={returnedBefore ?? ""}
            min={returnedAfter ?? undefined}
            disabled={!returnedAfter}
            onChange={(e) =>
              setReturnedBefore(e.target.value !== "" ? e.target.value : null)
            }
            className="border border-gray-4 rounded-3xl px-2 py-1 text-xs cursor-pointer 
                       hover:bg-gray-1 active:bg-gray-2 disabled:opacity-40"
          />
        </label>
      </div>

    </div>
  )
}

export default DateFilterLoans
