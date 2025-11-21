import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { SectionResponse, CreateSection } from '@/lib/api/models/section'

export const useCreateSection = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSection = async (payload: CreateSection) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<SectionResponse>('/sections', {
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

  return { createSection, loading, error }
}
