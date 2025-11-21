import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import { useKeys } from '../index/key-context'
import Loader from '@ui/loader'
import { CreateCatalog_Key } from '@/lib/api/models/catalog-key'

const CreateKeyModal = () => {
  const { isCreateOpen, closeCreate, handleCreate, loadingCreate } =
    useKeys()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCatalog_Key>()

  const onSubmit = async (data: CreateCatalog_Key) => {
    await handleCreate(data)
    reset()
  }

  if (!isCreateOpen) return null

  return (
    <Modal visible onClose={closeCreate} className=" ">
      <div className="flex flex-col gap-4 px-2 md:px-4">
        <div className="text-center gap-2 flex flex-col">
          <h2 className=" text-xl md:text-2xl font-bold text-blue-600">
            Crear Clave de Catálogo
          </h2>
          <p className="text-sm">
            Ingresa los datos de la clave que deseas registrar.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <div className="w-full grid grid-cols-2 justify-between gap-4">
            <FormInput
              name="name"
              label="Nombre"
              placeholder="Nombre de la clave"
              register={register}
              errors={errors}
              rules={{ required: 'Nombre obligatorio' }}
            />

            <FormInput
              name="description"
              label="Descripción"
              placeholder="Ingresa una descripción"
              register={register}
              errors={errors}
              rules={{ required: 'Descripción obligatoria' }}
            />
          </div>
          <div className="w-full grid grid-cols-2 gap-4 justify-between">
            <FormInput
              name="key"
              label="Clave de catálogo"
              placeholder="Ingresa la clave de catálogo"
              register={register}
              errors={errors}
              rules={{ required: 'Clave obligatoria' }}
              toUpper
            />
            {/* SELECT DE Tipo de entidad */}
            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="entity_type" className="text-sm font-bold ">
                Tipo de entidad
              </label>
              <select
                id="entity_type"
                className="rounded-3xl border border-gray-4 px-2 py-1 text-xs bg-white  cursor-pointer"
                {...register('entity_type', { required: 'Tipo entidad obligatorio' })}
              >
                <option className="cursor-pointer" value="fund">
                  Fondo
                </option>
                <option className='cursor-pointer"' value="section">Sección</option>
                <option className='cursor-pointer"' value="series">Serie</option>
              </select>
              {errors.entity_type && (
                <span className="text-[10px] text-red ">
                  {errors.entity_type.message as string}
                </span>
              )}
            </div>
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

export default CreateKeyModal
