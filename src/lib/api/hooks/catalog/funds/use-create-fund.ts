import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { CreateFund, FundResponse } from '@/lib/api/models/fund'

export const useCreateFund = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createFund = async (payload: CreateFund) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<FundResponse>('/funds', {
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

  return { createFund, loading, error }
}
