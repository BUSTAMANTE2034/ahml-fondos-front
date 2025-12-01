import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@contexts/authContext'
import Loader from '@ui/loader'

type ProtectedRouteProps = {
  allowedRoles?: string[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className='flex items-center w-full h-screen'>
        <Loader label='Cargando...' className='text-xl' size={80}/>
      </div>
    )
  }

  // Usuario no logueado → Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // ⭐ EXCEPCIÓN: permitir regresar al login
  if (user.first_login && window.location.pathname === "/login") {
    return <Outlet />;
  }

  // 🔥 Bloqueo global, excepto login
  if (user.first_login && window.location.pathname !== "/first-login") {
    return <Navigate to="/first-login" replace />
  }

  // Validación de roles
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/${user.id}`} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
