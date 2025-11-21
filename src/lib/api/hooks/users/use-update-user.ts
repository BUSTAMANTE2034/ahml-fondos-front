import { useState } from 'react'
import { UserResponse, UpdateUser } from '@models/user'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateUser = async (id: number | null, user: UpdateUser) => {
    if (!id) return
    setLoading(true)
    setError(null)
    
    try {
      const data = await apiFetch<UserResponse>(`/users/${id}`, {
        method: 'PUT',
        body: user,
      })
      return data
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al actualizar usuario.')
      } else {
        setError('Error desconocido.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }
  return { updateUser, loading, error }
}
