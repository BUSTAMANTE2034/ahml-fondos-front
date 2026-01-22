import { useLocations } from "@/components/modules/catalog/locations/index/location-context"
import {
  ArrowUpAZ,
  ArrowDownAZ,
  Clock4,
  Type,
} from "lucide-react"

const ORDER_FIELDS = [
  { value: "updated_at", label: "Última actualización", icon: Clock4 },
  { value: "name", label: "Nombre de la localidad", icon: Type },
] as const

const FilterOrderLocations = () => {
  const { order_by, setOrderBy } = useLocations()

  const applyOrder = (field: string, dir: "asc" | "desc") => {
    setOrderBy(`${field}_${dir}` as any)
  }

  return (
    <div className="flex flex-col gap-2">
      {ORDER_FIELDS.map((f) => {
        const isAsc = order_by === `${f.value}_asc`
        const isDesc = order_by === `${f.value}_desc`
        const Icon = f.icon

        return (
          <div key={f.value} className="flex flex-row items-center gap-1">
            <Icon size={16} />

            <span className="flex-1 text-xs">{f.label}</span>

            {/* ASC */}
            <button
              className={`p-1 rounded-2xl cursor-pointer ${
                isAsc
                  ? "bg-blue-600 text-white"
                  : "hover:bg-white active:bg-main-gray"
              }`}
              onClick={() => applyOrder(f.value, "asc")}
            >
              <ArrowUpAZ size={16} />
            </button>

            {/* DESC */}
            <button
              className={`p-1 rounded-2xl cursor-pointer ${
                isDesc
                  ? "bg-blue-600 text-white"
                  : "hover:bg-white active:bg-main-gray"
              }`}
              onClick={() => applyOrder(f.value, "desc")}
            >
              <ArrowDownAZ size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default FilterOrderLocations
