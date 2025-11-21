import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { UpdateTypology, TypologyResponse } from '@/lib/api/models/typology'

export const useUpdateTypology = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateTypology = async (id: number | null, payload: UpdateTypology) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<TypologyResponse>(`/typologies/${id}`, {
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

  return { updateTypology, loading, error }
}
