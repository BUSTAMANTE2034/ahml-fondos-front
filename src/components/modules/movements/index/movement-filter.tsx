import MenuDesplegable from "@ui/myMenu"
import Filter from "@icons/filter.svg"
import { useMovements } from "./movement-context"
import SingleDatePicker from "@/components/ui/dataPiker"
import { MovementStatus } from "@/lib/api/models/movement"

const MOVEMENT_STATUS_OPTIONS: { value: MovementStatus | ""; label: string }[] = [
  { value: "", label: "Todos" },
  { value: "available", label: "Disponible" },
  { value: "under_review", label: "En revisión" },
  { value: "unavailable", label: "No disponible" },
]

const MovementFilter = () => {
  const {
    movedAfter,
    movedBefore,
    originStatus,
    destinationStatus,

    setMovedAfter,
    setMovedBefore,
    setOriginStatus,
    setDestinationStatus,
  } = useMovements()

  const anyFilterActive =
    movedAfter !== null ||
    movedBefore !== null ||
    originStatus !== null ||
    destinationStatus !== null

  return (
    <div className="flex flex-row justify-between items-center">
      <span
        className={`${
          anyFilterActive ? "text-tblack font-semibold" : "text-dark-gray2"
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable
        className="w-44"
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
        {/* ============================= */}
        {/*   ESTADO DE ORIGEN           */}
        {/* ============================= */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-700">
            Estado de origen
          </label>

          <select
            className="input2 text-xs h-6 p-0"
            value={originStatus ?? ""}
            onChange={(e) =>
              setOriginStatus(
                e.target.value === "" ? null : (e.target.value as MovementStatus)
              )
            }
          >
            {MOVEMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full border-t border-gray-3 my-2" />

        {/* ============================= */}
        {/*   ESTADO DE DESTINO          */}
        {/* ============================= */}
        <div className="flex flex-col gap-1 pb-2">
          <label className="text-xs font-semibold text-gray-700">
            Estado de destino
          </label>

          <select
            className="input2 text-xs h-6 p-0"
            value={destinationStatus ?? ""}
            onChange={(e) =>
              setDestinationStatus(
                e.target.value === "" ? null : (e.target.value as MovementStatus)
              )
            }
          >
            {MOVEMENT_STATUS_OPTIONS.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full border-t border-gray-3 my-2" />

        {/* ============================= */}
        {/*        DATE FILTERS           */}
        {/* ============================= */}
        <SingleDatePicker
          label="Movido desde"
          value={movedAfter}
          onChange={setMovedAfter}
        />

        <SingleDatePicker
          label="Movido hasta"
          value={movedBefore}
          onChange={setMovedBefore}
        />
      </MenuDesplegable>
    </div>
  )
}

export default MovementFilter
