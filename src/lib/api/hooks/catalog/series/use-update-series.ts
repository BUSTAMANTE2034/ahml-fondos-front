import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { SeriesResponse, UpdateSeries } from '@/lib/api/models/series'

export const useUpdateSeries = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateSeries = async (id: number | null, payload: UpdateSeries) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<SeriesResponse>(`/series/${id}`, {
        method: 'PUT',
        body: payload
      })
      return data
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Error desconocido.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateSeries, loading, error }
}
