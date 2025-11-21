import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { UpdateDeterioration, DeteriorationResponse } from '@/lib/api/models/deterioration'

export const useUpdateDeterioration = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateDeterioration = async (id: number | null, payload: UpdateDeterioration) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<DeteriorationResponse>(`/deteriorations/${id}`, {
        method: 'PUT',
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

  return { updateDeterioration, loading, error }
}
