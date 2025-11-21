import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const usePrintCoverPage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const printCover = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const blob = await apiFetch<Blob>(
        `/record-files/print-cover-page?record_file_id=${id}`,
        { method: "GET", parse: "blob"  }
      )

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = `caratula_expediente_${id}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || "Error al generar carátula.")
      } else {
        setError("Error inesperado al generar carátula.")
      }
    } finally {
      setLoading(false)
    }
  }

  return { printCover, loading, error }
}
