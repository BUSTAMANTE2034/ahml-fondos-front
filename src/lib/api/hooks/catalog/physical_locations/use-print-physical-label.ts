import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const usePrintPhysicalLocationLabel = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const printLabel = async (code: string) => {
    setLoading(true)
    setError(null)

    try {
      const blob = await apiFetch<Blob>(
        `/physical_locations/${code}/label`,
        {
          method: 'GET',
          parse: 'blob',
        }
      )

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = `etiqueta_estanteria_${code}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()

      // opcional: limpiar memoria
      window.URL.revokeObjectURL(url)

    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al generar etiqueta.')
      } else {
        setError('Error inesperado al generar etiqueta.')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    printLabel,
    loading,
    error,
  }
}
