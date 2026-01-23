import { useState, useEffect } from "react"
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
  X,
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

type OrderDir = "asc" | "desc"

type OrderState = {
  data?: `${string}_${OrderDir}`
  date?: `${string}_${OrderDir}`
}

/* =========================
   COMPONENTE
========================= */

const FilterOrder = () => {
  const { order_by, setOrderBy } = useRecordFiles()

  // estado interno UI
  const [orderState, setOrderState] = useState<OrderState>({})

  /* =========================================================
     SINCRONIZAR CON CONTEXTO (opcional pero recomendado)
  ========================================================= */
  useEffect(() => {
    if (!order_by) {
      setOrderState({})
      return
    }

    const parts = order_by.split(",")

    const next: OrderState = {}

    parts.forEach(p => {
      if (
        p.includes("date") ||
        p.includes("created_at") ||
        p.includes("updated_at") ||
        p.includes("deterioration_status_updated_at")
      ) {
        next.date = p as any
      } else {
        next.data = p as any
      }
    })

    setOrderState(next)
  }, [order_by])

  /* =========================================================
     APLICAR ORDEN
  ========================================================= */
  const applyOrder = (
    field: string,
    dir: OrderDir,
    type: "data" | "date"
  ) => {
    setOrderState(prev => {
      const next = {
        ...prev,
        [type]: `${field}_${dir}`,
      }

      const combined =
        [next.data, next.date].filter(Boolean).join(",") || null

      setOrderBy(combined as any)

      return next
    })
  }

  const clearOrder = (type: "data" | "date") => {
    setOrderState(prev => {
      const next = { ...prev }
      delete next[type]

      const combined =
        [next.data, next.date].filter(Boolean).join(",") || null

      setOrderBy(combined as any)

      return next
    })
  }

  /* =========================================================
     RENDER
  ========================================================= */
  const renderField = (f: any, type: "data" | "date") => {
    const current = orderState[type]
    const isAsc = current === `${f.value}_asc`
    const isDesc = current === `${f.value}_desc`
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
          onClick={() => applyOrder(f.value, "asc", type)}
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
          onClick={() => applyOrder(f.value, "desc", type)}
        >
          <ArrowDownAZ size={16} />
        </button>

        {/* CLEAR */}
        {(isAsc || isDesc) && (
          <button
            className="p-1 rounded-2xl text-red-500 hover:bg-red-50"
            onClick={() => clearOrder(type)}
          >
            <X size={14} />
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* =========================
          FECHAS
      ========================= */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-dark-gray2">
          Fechas
        </span>

        {DATE_FIELDS.map(f => renderField(f, "date"))}
      </div>

      {/* =========================
          DATOS
      ========================= */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-dark-gray2">
          Datos
        </span>

        {DATA_FIELDS.map(f => renderField(f, "data"))}
      </div>
    </div>
  )
}

export default FilterOrder
