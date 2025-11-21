import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { SeriesResponse, CreateSeries } from '@/lib/api/models/series'

export const useCreateSeries = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSeries = async (payload: CreateSeries) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<SeriesResponse>('/series', {
        method: 'POST',
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

  return { createSeries, loading, error }
}
