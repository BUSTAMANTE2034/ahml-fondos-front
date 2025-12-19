import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

interface ExportExcelOptions {
  perPage?: number

  // búsqueda global
  query?: string

  // minis
  reference_code?: string
  previous_reference_code?: string
  file_number?: string
  box_number?: string

  // ==========================
  // RELACIONES (SOLO ID)
  // ==========================
  fund_id?: number
  section_id?: number
  series_id?: number

  // ==========================
  // OTRAS RELACIONES (AÚN POR NOMBRE)
  // ==========================
  location_name?: string
  deterioration_name?: string
  typology_name?: string

  // flags
  sensitive?: string
  availability_status?: string

  // fechas documental
  file_date_after?: string | null
  file_date_before?: string | null

  // ordenamiento
  order_by?: string | null
}

export const useExportRecordFilesExcel = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportExcel = async (filters: ExportExcelOptions = {}) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      params.append("per_page", String(filters.perPage ?? 50))

      // búsqueda global
      if (filters.query) params.append("query", filters.query)

      // filtros directos
      if (filters.reference_code)
        params.append("reference_code", filters.reference_code)

      if (filters.previous_reference_code)
        params.append("previous_reference_code", filters.previous_reference_code)

      if (filters.file_number)
        params.append("file_number", filters.file_number)

      if (filters.box_number)
        params.append("box_number", filters.box_number)

      // ==========================
      // RELACIONES (SOLO ID)
      // ==========================
      if (filters.fund_id)
        params.append("fund_id", String(filters.fund_id))

      if (filters.section_id)
        params.append("section_id", String(filters.section_id))

      if (filters.series_id)
        params.append("series_id", String(filters.series_id))

      // ==========================
      // OTRAS RELACIONES (NAME)
      // ==========================
      if (filters.location_name)
        params.append("location_name", filters.location_name)

      if (filters.deterioration_name)
        params.append("deterioration_name", filters.deterioration_name)

      if (filters.typology_name)
        params.append("typology_name", filters.typology_name)

      // confidencialidad
      if (filters.sensitive && filters.sensitive !== "all")
        params.append("sensitive", filters.sensitive)

      // disponibilidad
      if (
        filters.availability_status &&
        filters.availability_status !== "all"
      )
        params.append("availability_status", filters.availability_status)

      // fechas documental
      if (filters.file_date_after)
        params.append("file_date_after", filters.file_date_after)

      if (filters.file_date_before)
        params.append("file_date_before", filters.file_date_before)

      // ordenamiento
      if (filters.order_by)
        params.append("order_by", filters.order_by)

      const url = `/record-files/export-excel?${params.toString()}`

      const blob = await apiFetch<Blob>(url, {
        method: "GET",
        parse: "blob",
      } as any)

      const fileURL = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = fileURL
      link.download = `reporte_expedientes.xlsx`

      document.body.appendChild(link)
      link.click()
      link.remove()

    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || "Error al generar Excel.")
      } else {
        setError("Error inesperado al generar Excel.")
      }
    } finally {
      setLoading(false)
    }
  }

  return { exportExcel, loading, error }
}