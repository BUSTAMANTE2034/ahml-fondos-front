import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import {
  UpdateDiagnosisCatalog,
  DiagnosisCatalogResponse,
} from '@/lib/api/models/diagnosis_catalog'

export const useUpdateDiagnosisCatalog = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDiagnosisCatalog = async (
    id: number | null,
    payload: UpdateDiagnosisCatalog
  ) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<DiagnosisCatalogResponse>(
        `/diagnosis_catalog/${id}`,
        {
          method: 'PUT',
          body: payload,
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

  return { updateDiagnosisCatalog, loading, error }
}
