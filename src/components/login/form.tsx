import { useForm } from 'react-hook-form'
import { useAuthUser } from '@hooks/auth/use-auth-user'
import Loader from '@ui/loader'
import { PostLogin } from '@models/auth'
import { useState } from 'react'

interface FormLoginProps {
  onSubmit: (data: PostLogin) => void | Promise<void>
  loading: boolean
}

const FormLogin = ({ onSubmit, loading: load }: FormLoginProps) => {
  const { loading } = useAuthUser()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostLogin>()

  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="w-full md:w-1/2 flex relative flex-1 items-center justify-center">
      {loading && <Loader />}
      <div className="min-w-[70%] flex flex-col px-6 py-8 rounded-3xl border border-black-0 bg-[#5E5E5E]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">
          Iniciar Sesión
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-1 text-base font-medium text-white">
              Correo Electrónico
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="Ingresa tu correo institucional"
              className="input"
              {...register('email', { required: 'Correo requerido' })}
            />
            {errors.email && (
              <p className="text-text-green text-xs md:text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password con ojo */}
          <div>
            <label className="block mb-1 text-base font-medium text-white">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                className="input pr-12"
                {...register('password', { required: 'Contraseña requerida' })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-3 my-auto h-9 w-9 grid place-items-center rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer"
              >
                {/* Ojo abierto (mostrar) */}
                {!showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  /* Ojo tachado (oculto) */
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a20.29 20.29 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.29 20.29 0 0 1-4.35 5.65" />
                    <path d="M1 1l22 22" />
                  </svg>
                )}
              </button>
            </div>

            {errors.password && (
              <p className="text-text-green text-xs md:text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="login-button w-full disabled:opacity-50"
            disabled={loading || load}
          >
            {load ? <Loader size={30} className='text-white!'/> : 'Acceder'}
          </button>
        </form>

      
      </div>
    </div>
  )
}

export default FormLogin
