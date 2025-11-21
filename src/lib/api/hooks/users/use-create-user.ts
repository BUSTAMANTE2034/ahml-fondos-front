import { useState } from 'react'
import { UserResponse, CreateUser } from '@models/user'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
export const useCreateUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const createUser = async (user: CreateUser) => {
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<UserResponse>('/users', {
        method: 'POST',
        body: user,
      })
      return data
    } catch (err:any) {
       if (err instanceof ApiError) {
        setError(err.message || 'Error al crear usuario.')
      } else {
        setError('Error desconocido.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }
  return { createUser, loading,error }
}
