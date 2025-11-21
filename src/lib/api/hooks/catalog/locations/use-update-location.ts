import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { UpdateLocation, LocationResponse } from '@/lib/api/models/location'

export const useUpdateLocation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateLocation = async (id: number | null, payload: UpdateLocation) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<LocationResponse>(`/locations/${id}`, {
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

  return { updateLocation, loading, error }
}
