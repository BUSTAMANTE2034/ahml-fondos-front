import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { CreateLocation, LocationResponse } from '@/lib/api/models/location'

export const useCreateLocation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createLocation = async (payload: CreateLocation) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<LocationResponse>('/locations', {
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

  return { createLocation, loading, error }
}
