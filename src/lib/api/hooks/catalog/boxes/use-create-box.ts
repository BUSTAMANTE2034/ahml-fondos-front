import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { CreateBox, BoxResponse } from '@/lib/api/models/box'

export const useCreateBox = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBox = async (payload: CreateBox) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<BoxResponse>('/boxes', {
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

  return { createBox, loading, error }
}
