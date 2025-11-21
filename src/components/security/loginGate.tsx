// LoginGate.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/authContext'
import { ReactNode } from 'react'

const LoginGate = ({ children }: { children: ReactNode}) => {
  const { isAuthenticated, user } = useAuth()
  if (isAuthenticated && user) {
    return <Navigate replace to={`/${user.role}/${user.id}`} />
  }
  return children
}
export default LoginGate
