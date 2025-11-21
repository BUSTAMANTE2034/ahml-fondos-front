import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { CreateDeterioration, DeteriorationResponse } from '@/lib/api/models/deterioration'

export const useCreateDeterioration = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDeterioration = async (payload: CreateDeterioration) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<DeteriorationResponse>('/deteriorations', {
        method: 'POST',
        body: payload,
      })
      return data
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Error desconocido.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createDeterioration, loading, error }
}
