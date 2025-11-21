import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { UpdateCatalog_Key, Catalog_KeyResponse } from '@models/catalog-key'

export const useUpdateCatalogKey = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateCatalogKey = async (id: number | null, payload: UpdateCatalog_Key) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<Catalog_KeyResponse>(`/catalog-keys/${id}`, {
        method: 'PUT',
        body: payload,
      })
      return data
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al actualizar la clave de catálogo.')
      } else {
        setError('Error desconocido.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateCatalogKey, loading, error }
}
