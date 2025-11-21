import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { SectionResponse, UpdateSection } from '@/lib/api/models/section'

export const useUpdateSection = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateSection = async (id: number | null, payload: UpdateSection) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<SectionResponse>(`/sections/${id}`, {
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

  return { updateSection, loading, error }
}
