import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import { useVisitors } from '../index/visitor-context'
import Loader from '@ui/loader'
import { CreateUser } from '@models/user'

const CreateVisitorModal = () => {
  const { isCreateOpen, closeCreate, handleCreate, loadingCreate } =
    useVisitors()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUser>({
    defaultValues: {
      role: 'visitor', // valor por defecto del select
    },
  })

  const onSubmit = async (data: CreateUser) => {
    await handleCreate({
      ...data,
      email: data.email.toLowerCase(),
    })
    reset()
  }

  if (!isCreateOpen) return null

  return (
    <Modal visible onClose={closeCreate} className=" ">
      <div className="flex flex-col gap-4 px-2 md:px-4">
        <div className="text-center gap-2 flex flex-col">
          <h2 className=" text-xl md:text-2xl font-bold text-blue-600">
            Crear Visitante
          </h2>
          <p className="text-sm">
            Ingresa los datos del visitante que deseas registrar.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <div className="w-full grid grid-cols-2 justify-between gap-4">
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
              placeholder="Ingresa el apellido"
              register={register}
              errors={errors}
              rules={{ required: 'Apellido obligatorio' }}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-4 justify-between">
            <FormInput
              name="employee_id"
              type='number'
              label="Número de empleado"
              placeholder="Ingresa el número de empleado"
              register={register}
              errors={errors}
              rules={{ required: 'Número de empleado obligatorio' }}
            />
            {/* SELECT DE ROL */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="role" className="text-sm font-bold ">
                Rol
              </label>
              <select
                id="role"
                className="rounded-2xl border border-gray-4 px-2 py-1 text-xs bg-white  cursor-pointer"
                {...register('role', { required: 'Rol obligatorio' })}
              >
                <option className="cursor-pointer" value="visitor">
                  Visitante
                </option>
                {/* <option value="archivist">Archivista</option>
                <option value="manager">Gestor</option> */}
              </select>
              {errors.role && (
                <span className="text-[10px] text-red ">
                  {errors.role.message as string}
                </span>
              )}
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-4 justify-between">
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
          {loadingCreate ? (
            <div className="flex items-center justify-center mx-auto gap-4">
              <span className="text-blue-600 font-medium text-lg">
                Creando...
              </span>
              <Loader size={20} />
            </div>
          ) : (
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={closeCreate} className="cancel">
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                className={`create ${
                  loadingCreate ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loadingCreate}
              >
                <span>Guardar</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  )
}

export default CreateVisitorModal
