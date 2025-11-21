import { apiFetch, setUnauthorizedHandler } from '@/lib/types/client'
import { User } from '@models/user'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useLogoutUser } from '@/lib/api/hooks/auth/use-logout-user'
import { useToast } from '@contexts/toastContext'
import { useNavigate } from 'react-router-dom'

export interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => Promise<void>
}

/**Creación del contexto */
const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**Creación del proveedor */
const USER_KEY = 'user'

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate()
  const { toastWarning, toastError } = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { logoutUser } = useLogoutUser()

  type MeShape = User | { user?: User } // tolera ambas respuestas

  // 🔹 Logout manual (por botón "Cerrar sesión", etc.)
  const logout = async () => {
    // si quieres mostrar una pantalla /logout, la mantengo
    navigate('/logout', { replace: true })
    try {
      await logoutUser()
      setUser(null)
      localStorage.removeItem(USER_KEY)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      navigate('/login', { replace: true })
    } catch (e) {
      setUser(null)
      localStorage.removeItem(USER_KEY)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      navigate('/login', { replace: true })
      toastError({ id: 101, title: 'Error', message: 'Sesión expirada.' })
    }
  }

  // 🔹 Carga y verificación inicial del usuario
  useEffect(() => {
    const initAuth = async () => {
      // 1) Carga local
      const stored = localStorage.getItem(USER_KEY)
      if (stored) {
        try {
          setUser(JSON.parse(stored))
        } catch {
          localStorage.removeItem(USER_KEY)
          setUser(null)
        }
      }

      // 2) Valida sesión en servidor
      try {
        const me = await apiFetch<MeShape>('auth/me', {
          method: 'GET',
          skipAuthHandling: true, // 👈 aquí NO queremos el logout global
        })

        const serverUser: User | undefined =
          (me as any)?.user ?? (me as any)

        if (serverUser) {
          setUser(serverUser)
          localStorage.setItem(USER_KEY, JSON.stringify(serverUser))
        } else {
          setUser(null)
          localStorage.removeItem(USER_KEY)
        }
      } catch (err: any) {
        // Sólo limpia en 401/403
        if (err?.status === 401 || err?.status === 403) {
          setUser(null)
          localStorage.removeItem(USER_KEY)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // 🔹 Sincroniza entre pestañas el usuario
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === USER_KEY) {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue))
          } catch {
            setUser(null)
            localStorage.removeItem(USER_KEY)
          }
        } else {
          setUser(null)
        }
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  // 🔹 Función login
  const login = (userData: User) => {
    setUser(userData)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }

  // 🔹 Handler global para cualquier 401 de apiFetch
  useEffect(() => {
    setUnauthorizedHandler(async () => {
      // Sólo hacemos algo si había un usuario
      if (user) {
        setUser(null)
        localStorage.removeItem(USER_KEY)

        toastWarning({
          id: 100,
          title: 'Sesión expirada',
          message: 'Tu sesión ha expirado, inicia sesión de nuevo.',
        })

        navigate('/login', { replace: true })
      }
    })

    // Limpia el handler al desmontar el provider
    return () => {
      setUnauthorizedHandler(null)
    }
  }, [user, navigate, toastWarning])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

//Acceso al contexto
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro del AuthProvider')
  return ctx
}
