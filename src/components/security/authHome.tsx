// AutoHome.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@contexts/authContext'
import Loader from '@ui/loader'

const AutoHome = () => {
  const { isLoading, isAuthenticated, user } = useAuth()
  const go = ()=>{
    return user?.role==='admin'?'managers':'record-files'
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader label="Cargando..." size={80} />
      </div>
    )
  }
  return (
    <Navigate
      replace
      to={isAuthenticated && user ? `/${user.role}/${user.id}/${go()}` : '/login'}
    />
  )
}
export default AutoHome
