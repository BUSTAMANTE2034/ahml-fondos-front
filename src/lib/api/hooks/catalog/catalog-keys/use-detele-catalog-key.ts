import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { Catalog_KeyResponse } from '@models/catalog-key'

export const useDeleteCatalogKey = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteCatalogKey = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<Catalog_KeyResponse>(`/catalog-keys/${id}`, {
        method: 'DELETE',
      })
      return data
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al eliminar la clave de catálogo.')
      } else {
        setError('Error desconocido.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteCatalogKey, loading, error }
}
