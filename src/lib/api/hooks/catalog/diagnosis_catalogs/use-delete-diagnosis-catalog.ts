import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { DiagnosisCatalogResponse } from '@/lib/api/models/diagnosis_catalog'

export const useDeleteDiagnosisCatalog = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteDiagnosisCatalog = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<DiagnosisCatalogResponse>(
        `/diagnosis_catalog/${id}`,
        {
          method: 'DELETE',
        }
      )
      return data
    } catch (err: any) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Error desconocido.'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteDiagnosisCatalog, loading, error }
}
