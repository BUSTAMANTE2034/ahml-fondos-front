import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import {
  CreateDiagnosisCatalog,
  DiagnosisCatalogResponse,
} from '@/lib/api/models/diagnosis_catalog'

export const useCreateDiagnosisCatalog = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDiagnosisCatalog = async (
    payload: CreateDiagnosisCatalog
  ) => {
    console.log('Payload create diagnosis catalog:', payload);
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<DiagnosisCatalogResponse>(
        '/diagnosis_catalog',
        {
          method: 'POST',
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

  return { createDiagnosisCatalog, loading, error }
}
