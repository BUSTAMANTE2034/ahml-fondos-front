import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { SectionResponse } from '@/lib/api/models/section'

export const useDeleteSection = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteSection = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<SectionResponse>(`/sections/${id}`, {
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

  return { deleteSection, loading, error }
}
