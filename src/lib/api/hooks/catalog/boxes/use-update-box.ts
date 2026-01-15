import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { UpdateBox, BoxResponse } from '@/lib/api/models/box'

export const useUpdateBox = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateBox = async (id: number | null, payload: UpdateBox) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<BoxResponse>(`/boxes/${id}`, {
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

  return { updateBox, loading, error }
}
