// LoginGate.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/authContext'
import { ReactNode } from 'react'

const LoginGate = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user } = useAuth()

  // 1️⃣ Usuario NO autenticado → permitir ver login
  if (!isAuthenticated || !user) {
    return children
  }

  // 2️⃣ Usuario autenticado PERO en primer login → permitir usar /login
  if (user.first_login) {
    return children
  }

  // 3️⃣ Usuario autenticado y NO en primer login → redirigir al dashboard
  return <Navigate replace to={`/${user.role}/${user.id}`} />
}

export default LoginGate
