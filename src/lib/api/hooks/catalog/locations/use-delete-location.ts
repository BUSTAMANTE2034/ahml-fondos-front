import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { LocationResponse } from '@/lib/api/models/location'

export const useDeleteLocation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteLocation = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<LocationResponse>(`/locations/${id}`, {
        method: 'DELETE',
      })
      return data
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Error desconocido.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteLocation, loading, error }
}
