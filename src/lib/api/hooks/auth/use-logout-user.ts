import { useState } from 'react'
import { apiFetch } from '@lib/types/client'
import { LogoutResponse } from '@models/auth'

export const useLogoutUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logoutUser = async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<LogoutResponse>('/auth/logout', {
        method: 'DELETE',
        skipAuthHandling:true
      })
      return data.message
    } catch (err: any) {
      setError(err.message ?? 'Error inesperado')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { logoutUser, loading, error }
}
