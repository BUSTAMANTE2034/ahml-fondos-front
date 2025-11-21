import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { UpdateFund, FundResponse } from '@/lib/api/models/fund'

export const useUpdateFund = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateFund = async (id: number | null, payload: UpdateFund) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<FundResponse>(`/funds/${id}`, {
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

  return { updateFund, loading, error }
}
