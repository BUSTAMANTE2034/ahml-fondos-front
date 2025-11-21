import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { CreateTypology, TypologyResponse } from '@/lib/api/models/typology'

export const useCreateTypology = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTypology = async (payload: CreateTypology) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<TypologyResponse>('/typologies', {
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

  return { createTypology, loading, error }
}
