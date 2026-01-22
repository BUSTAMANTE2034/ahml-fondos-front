import { useRecordFiles } from "../../record-file-context"
import {
  ArrowUpAZ,
  ArrowDownAZ,
  CalendarDays,
  Clock4,
  ShieldAlert,
  Hash,
  FileText,
  FolderTree,
  Layers,
  Archive,
  MapPin,
  Tag,
} from "lucide-react"

/* =========================
   DEFINICIÓN DE CAMPOS
========================= */

const DATE_FIELDS = [
  {
    value: "updated_at",
    label: "Última actualización",
    icon: Clock4,
  },
  {
    value: "created_at",
    label: "Fecha de creación",
    icon: CalendarDays,
  },
  {
    value: "file_date",
    label: "Fecha del documento",
    icon: CalendarDays,
  },
  {
    value: "deterioration_status_updated_at",
    label: "Último deterioro",
    icon: ShieldAlert,
  },
] as const

const DATA_FIELDS = [
  {
    value: "box_number",
    label: "Número de caja",
    icon: Hash,
  },
  {
    value: "file_number",
    label: "Número de expediente",
    icon: FileText,
  },
  {
    value: "reference_code",
    label: "Código de clasificación",
    icon: Tag,
  },
  {
    value: "previous_reference_code",
    label: "Referencia anterior",
    icon: Tag,
  },
  {
    value: "fund_name",
    label: "Fondo",
    icon: FolderTree,
  },
  {
    value: "section_name",
    label: "Sección",
    icon: Layers,
  },
  {
    value: "series_name",
    label: "Serie",
    icon: Archive,
  },
  {
    value: "location_name",
    label: "Ubicación",
    icon: MapPin,
  },
] as const

/* =========================
   COMPONENTE
========================= */

const FilterOrder = () => {
  const { order_by, setOrderBy } = useRecordFiles()

  const applyOrder = (field: string, dir: "asc" | "desc") => {
    setOrderBy(`${field}_${dir}` as any)
  }

  const renderField = (f: any) => {
    const isAsc = order_by === `${f.value}_asc`
    const isDesc = order_by === `${f.value}_desc`
    const Icon = f.icon

    return (
      <div
        key={f.value}
        className="flex flex-row items-center gap-1"
      >
        <Icon size={16} />

        <span className="flex-1 text-xs">
          {f.label}
        </span>

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
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      {/* =========================
          COLUMNA FECHAS
      ========================= */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-dark-gray2">
          Fechas
        </span>

        {DATE_FIELDS.map(renderField)}
      </div>

      {/* =========================
          COLUMNA DATOS
      ========================= */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-dark-gray2">
          Datos
        </span>

        {DATA_FIELDS.map(renderField)}
      </div>
    </div>
  )
}

export default FilterOrder
