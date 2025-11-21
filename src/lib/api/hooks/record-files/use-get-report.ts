import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useExportRecordFilesPDF = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const exportPDF = async (filters: Record<string, any> = {}) => {
    setLoading(true)
    setError(null)

    try {
      // construir query params
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== "") {
          params.append(k, String(v))
        }
      })

      const qs = params.toString()
      const url = `/record-files/export-pdf${qs ? `?${qs}` : ""}`

      // descarga del blob
      const blob = await apiFetch<Blob>(url, {
        method: "GET",
      })

      const fileURL = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = fileURL
      link.download = "reporte_expedientes.pdf"

      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || "Error al exportar PDF.")
      } else {
        setError("Error inesperado al exportar PDF.")
      }
    } finally {
      setLoading(false)
    }
  }

  return { exportPDF, loading, error }
}
