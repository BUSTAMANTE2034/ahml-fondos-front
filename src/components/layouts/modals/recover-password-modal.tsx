import { useForm } from 'react-hook-form'
import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { FormInput } from '@/components/forms/input'
import { useChangePassword } from '@hooks/auth/use-change-password'
import { useChangePasswordModal } from '@contexts/changePasswordContext'
import { useToast } from '@contexts/toastContext'
import { useAuth } from '@contexts/authContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface ChangePasswordForm {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

const ChangePasswordModal = () => {
  const { isCPModalOpen, closeCPModal } = useChangePasswordModal()
  const { changePassword, loading } = useChangePassword()
  const { toastSuccess, toastError } = useToast()
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>()

  const [successView, setSuccessView] = useState(false)

  const newPass = watch('new_password')

  if (!isCPModalOpen) return null

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      await changePassword(data)

      toastSuccess({
        id: 900,
        title: '¡Contraseña cambiada!',
        message: 'Tu contraseña fue actualizada correctamente.',
      })

      // 🔥 IMPORTANTE: Actualizamos el usuario en contexto
      if (user) {
        login({ ...user, first_login: false })
      }

      reset()
      setSuccessView(true)
    } catch (err: any) {
      toastError({
        id: 901,
        title: 'Error',
        message: err?.message || 'No se pudo cambiar la contraseña.',
      })
    }
  }

  // ================================
  //  VISTA DE ÉXITO
  // ================================
  if (successView) {
    return (
      <Modal visible onClose={() => {}}>
        <div className="flex flex-col gap-4 px-2 md:px-4 text-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            ¡Contraseña actualizada!
          </h2>

          <p className="text-sm">¿Deseas continuar o cerrar sesión?</p>

          <div className="flex flex-col md:flex-row justify-center gap-4 mt-4">
            {/* SEGUIR LOGUEADO */}
            <button
              className="create"
              onClick={() => {
                setSuccessView(false)
                closeCPModal()

                // 🔥 Redirigir al dashboard según rol
                if (user) {
                  navigate(`/${user.role}/${user.id}`, { replace: true })
                }
              }}
            >
              <span>Continuar</span>
            </button>

            {/* CERRAR SESIÓN */}
            <button
              className="cancel bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                logout()
                closeCPModal()
              }}
            >
              <span>Cerrar sesión</span>
            </button>
          </div>
        </div>
      </Modal>
    )
  }
  const fullName = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim()
  const email = user?.email ?? ''
  // ================================
  //  FORMULARIO NORMAL
  // ================================
  return (
    <Modal visible onClose={() => {}}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-blue-600">
            Cambio obligatorio de contraseña
          </h2>
          <div className="text-sm text-gray-700">
            <p className="font-semibold">{fullName}</p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Por motivos de seguridad, debes actualizar tu contraseña antes de
            continuar. <br />
            Esta acción es obligatoria porque tu cuenta utiliza una contraseña
            temporal o es tu primer inicio de sesión en el sistema.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="w-full grid grid-cols-2 gap-4">
            <FormInput
              name="current_password"
              label="Contraseña Temporal"
              type="password"
              placeholder="Ingresa tu contraseña temporal"
              register={register}
              errors={errors}
              rules={{ required: 'La contraseña temporal es obligatoria' }}
            />

            <FormInput
              name="new_password"
              label="Nueva contraseña"
              type="password"
              placeholder="Ingresa la nueva contraseña"
              register={register}
              errors={errors}
              rules={{
                required: 'Nueva contraseña obligatoria',
                validate: (value) => {
                  const regex =
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
                  return regex.test(value)
                    ? true
                    : 'Debe tener mayúscula, minúscula, número, símbolo y mínimo 8 caracteres.'
                },
              }}
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <FormInput
              name="new_password_confirmation"
              label="Confirmar contraseña"
              type="password"
              placeholder="Confirma tu nueva contraseña"
              register={register}
              errors={errors}
              rules={{
                required: 'Confirma la contraseña',
                validate: (value) =>
                  value === newPass || 'Las contraseñas no coinciden.',
              }}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center mx-auto gap-4 py-2">
              <span className="text-blue-600 font-medium text-lg">
                Guardando...
              </span>
              <Loader size={20} />
            </div>
          ) : (
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/login', { replace: true })}
                className="cancel"
              >
                <span>Volver</span>
              </button>

              <button type="submit" className="create">
                <span>Cambiar contraseña</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  )
}

export default ChangePasswordModal
