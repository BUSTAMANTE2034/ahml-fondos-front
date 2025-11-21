import { useState } from 'react'
import { CreateCatalog_Key, Catalog_KeyResponse } from '@models/catalog-key'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useCreateCatalogKey = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createCatalogKey = async (payload: CreateCatalog_Key) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<Catalog_KeyResponse>('/catalog-keys', {
        method: 'POST',
        body: payload,
      })
      return data
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al crear la clave de catálogo.')
      } else {
        setError('Error desconocido.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createCatalogKey, loading, error }
}
