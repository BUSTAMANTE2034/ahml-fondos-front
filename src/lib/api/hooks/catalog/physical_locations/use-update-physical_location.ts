import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { UpdatePhysicalLocation, PhysicalLocationResponse } from '@/lib/api/models/physical_location'

export const useUpdatePhysicalLocation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updatePhysicalLocation = async (id: number | null, payload: UpdatePhysicalLocation) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<PhysicalLocationResponse>(`/physical_locations/${id}`, {
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

  return { updatePhysicalLocation, loading, error }
}
