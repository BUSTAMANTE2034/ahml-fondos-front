import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { SeriesResponse } from '@/lib/api/models/series'

export const useDeleteSeries = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteSeries = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<SeriesResponse>(`/series/${id}`, {
        method: 'DELETE'
      })
      return data
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Error desconocido.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteSeries, loading, error }
}
