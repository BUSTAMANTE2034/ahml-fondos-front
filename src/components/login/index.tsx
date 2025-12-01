import AHML from '@png/ahml-fondo.jpg'
import Header from './header'
import Branding from './branding'
import Footer from './footer'
import FormLogin from './form'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@contexts/authContext'
import { useAuthUser } from '@/lib/api/hooks/auth/use-auth-user'
import { PostLogin } from '@/lib/api/models/auth'
import { useToast } from '@contexts/toastContext'
import { getStandarMessageError, getApiMessage } from '@lib/types/errors'
const LoginComponent = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toastSuccess, toastError } = useToast()
  const { authUser, loading } = useAuthUser()
  const handleLoginSubmit = async (data: PostLogin) => {
    try {
      const u = await authUser(data)
      
if (u.first_login) {
  navigate("/first-login", { replace: true });
  return;
}

      switch (u.role) {
        case 'admin':
          navigate(`/admin/${u.id}/managers`, { replace: true })
          break
        case 'manager':
          navigate(`/manager/${u.id}/record-files`, { replace: true })
          break
        case 'archivist':
          navigate(`/archivist/${u.id}/record-files`, { replace: true })
          break
         case 'visitor':
          navigate(`/visitor/${u.id}/record-files`, { replace: true })
          break
        default:
          toastError({
            id: Date.now(),
            title: 'Error',
            message: 'Usuario desconocido',
          })
          return
      }

      toastSuccess({
        id: Date.now(),
        title: '¡Éxito!',
        message: `Bienvenido ${u.first_name}`,
      })
    } catch (err: any) {
      const msg =
        getStandarMessageError(err) ||
        getApiMessage(err) ||
        err?.message ||
        'Error al iniciar sesión'
      toastError({ id: Date.now(), title: 'Error', message: msg })
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-y-hidden flex flex-col">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${AHML})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Header arriba */}
      <div className="fixed z-20 w-full top-0">
        <Header />
      </div>

      {/* Contenido que sí crece */}
      <div className="relative z-10 flex flex-1 w-full flex-col md:flex-row pt-4 md:pt-0">
        <div className="flex w-full md:w-1/2 items-center justify-center text-white">
          <Branding />
        </div>

        {/* Pasa loading si tu <FormLogin> lo necesita para deshabilitar el submit */}
        <FormLogin onSubmit={handleLoginSubmit} loading={loading} />
      </div>

      {/* Footer abajo */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  )
}

export default LoginComponent
