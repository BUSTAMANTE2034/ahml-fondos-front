import { useState } from 'react'
import { apiFetch } from '@lib/types/client'
import { LoginResponse, PostLogin } from '@models/auth'
import { useAuth } from '@/components/contexts/authContext'
export const useAuthUser = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const authUser = async (user: PostLogin) => {
    setLoading(true)
    const u ={...user,remember_me:true}
    try {
      const data = await apiFetch<LoginResponse>('/auth/login', {
        method: 'POST',
        body: u,
      })
      login(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  return { authUser, loading }
}
