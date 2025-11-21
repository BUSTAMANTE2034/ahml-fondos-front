import { useEffect } from 'react'
import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import Loader from '@ui/loader'
import { useVisitors } from '../index/visitor-context'
import { UpdateUser } from '@models/user'

const UpdateVisitorModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useVisitors()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateUser>()

  // Para validar que ambas contraseñas coincidan
  const password = watch('password')

  // Cargar datos del seleccionado
  useEffect(() => {
    if (selected) {
      reset({
        first_name: selected.first_name,
        last_name: selected.last_name,
        email: selected.email,
        employee_id: selected.employee_id,
        role: selected.role,
      })
    }
  }, [selected, reset])

  const onSubmit = async (data: UpdateUser) => {
    await handleUpdate({
      ...data,
      email: data.email?.toLowerCase(),
    })
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal visible onClose={closeEdit}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Editar Visitante
          </h2>
          <p className="text-sm">Actualiza la información del visitante.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          {/* Nombre y Apellido */}
          <div className="w-full grid grid-cols-2 gap-4">
            <FormInput
              name="first_name"
              label="Nombres"
              placeholder="Nombre del visitante"
              register={register}
              errors={errors}
              rules={{ required: 'Nombre obligatorio' }}
            />

            <FormInput
              name="last_name"
              label="Apellidos"
              placeholder="Ingresa los apellidos"
              register={register}
              errors={errors}
              rules={{ required: 'Apellido obligatorio' }}
            />
          </div>

          {/* Employee ID + Role */}
          <div className="w-full grid grid-cols-2 gap-4">
            <FormInput
              name="employee_id"
              label="Número de empleado"
              placeholder="Número de empleado"
              register={register}
              errors={errors}
              rules={{ required: 'Número de empleado obligatorio' }}
            />

            <div className="flex flex-col gap-1 w-full cursor-pointer">
              <label htmlFor="role" className="text-sm font-bold ">
                Rol
              </label>
              <select
                id="role"
                className="rounded-2xl border border-gray-4 px-2 py-1 text-xs bg-gray-2 cursor-pointer "
                // disabled
                {...register('role')}
              ><option value="visitor">Visitante</option>
                <option value="manager">Gestor</option>
                <option value="archivist">Archivista</option>
                
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="w-full">
            <FormInput
              name="email"
              label="Correo"
              placeholder="Ingresa el correo"
              register={register}
              errors={errors}
              rules={{
                required: 'Correo obligatorio',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Correo inválido',
                },
              }}
            />
          </div>

          {/* Password (Opcional) */}
          <div className="w-full grid grid-cols-2 gap-4">
            <FormInput
              name="password"
              label="Nueva contraseña"
              placeholder="(Opcional)"
              type="password"
              register={register}
              errors={errors}
              rules={{
                validate: {
                  strongPassword: (value) => {
                    if (!value || typeof value !== 'string') return true // <- FIX REAL

                    const regex =
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

                    return regex.test(value)
                      ? true
                      : 'Debe contener mayúscula, minúscula, número, caracter especial y mínimo 8 caracteres.'
                  },
                },
              }}
            />

            <FormInput
              name="password_confirmation"
              label="Confirmar contraseña"
              placeholder="(Opcional)"
              type="password"
              register={register}
              errors={errors}
              rules={{
                validate: (value) => {
                  if (!password) return true // si no escribió contraseña, no validar
                  if (value === password) return true

                  return 'Las contraseñas no coinciden.'
                },
              }}
            />
          </div>

          {/* Botones */}
          {loadingUpdate ? (
            <div className="flex items-center justify-center mx-auto gap-4">
              <span className="text-blue-600 font-medium text-lg">
                Actualizando...
              </span>
              <Loader size={20} />
            </div>
          ) : (
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={closeEdit} className="cancel">
                <span>Cancelar</span>
              </button>

              <button
                type="submit"
                className={`create ${
                  loadingUpdate ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Guardar cambios</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  )
}

export default UpdateVisitorModal
