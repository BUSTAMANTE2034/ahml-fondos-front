import { apiFetch } from '@/lib/types/client'
import { useState } from 'react'
import { UserResponse } from '../../models/user'
import { ApiError } from '@/lib/types/errors'

export const useDeleteUser = () => {
  const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
  const deleteUser = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await apiFetch<UserResponse>(`/users/${id}`, {
        method: 'DELETE',
      })
      return data
    }catch(err:any){
       if (err instanceof ApiError) {
        setError(err.message || 'Error al eliminar usuario.')
      } else {
        setError('Error desconocido.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }
  return { loading, deleteUser,error }
}
