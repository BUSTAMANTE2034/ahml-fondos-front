import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { PhysicalLocationResponse } from '@/lib/api/models/physical_location'

export const useDeletePhysicalLocation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deletePhysicalLocation = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<PhysicalLocationResponse>(`/physical_locations/${id}`, {
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

  return { deletePhysicalLocation, loading, error }
}
