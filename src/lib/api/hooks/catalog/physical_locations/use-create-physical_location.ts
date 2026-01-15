import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { CreatePhysicalLocation, PhysicalLocationResponse } from '@/lib/api/models/physical_location'

export const useCreatePhysicalLocation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPhysicalLocation = async (payload: CreatePhysicalLocation) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<PhysicalLocationResponse>('/physical_locations', {
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

  return { createPhysicalLocation, loading, error }
}
