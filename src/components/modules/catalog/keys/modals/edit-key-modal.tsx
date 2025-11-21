import { useEffect } from 'react'
import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import Loader from '@ui/loader'
import { useKeys } from '../index/key-context'
import { UpdateCatalog_Key } from '@/lib/api/models/catalog-key'

const UpdateKeyModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useKeys()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCatalog_Key>()

  // Cargar valores en formulario al abrir
  useEffect(() => {
    if (selected) {
      reset({
        name: selected.name,
        description: selected.description,
        key: selected.key,
        entity_type: selected.entity_type,
      })
    }
  }, [selected, reset])

  const onSubmit = async (data: UpdateCatalog_Key) => {
    await handleUpdate(data)
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal visible onClose={closeEdit}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Editar Clave de Catálogo
          </h2>
          <p className="text-sm">Actualiza la información de la clave.</p>
        </div>

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          {/* Name + Description */}
          <div className="w-full grid grid-cols-2 gap-4">
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

          {/* Key + Tipo */}
          <div className="w-full grid grid-cols-2 gap-4">
            <FormInput
              name="key"
              label="Clave"
              placeholder="Clave del catálogo"
              register={register}
              errors={errors}
              rules={{ required: 'Clave obligatoria' }}
              toUpper
            />

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="entity_type" className="text-sm font-bold ">
                Tipo de entidad
              </label>
              <select
                id="entity_type"
                className="rounded-2xl border border-gray-4 px-2 py-1 text-xs bg-white cursor-pointer"
                {...register('entity_type', {
                  required: 'Tipo entidad obligatorio',
                })}
              >
                <option value="fund">Fondo</option>
                <option value="section">Sección</option>
                <option value="series">Serie</option>
              </select>

              {errors.entity_type && (
                <span className="text-[10px] text-red">
                  {errors.entity_type.message as string}
                </span>
              )}
            </div>
          </div>

          {/* Loader o botones */}
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
                disabled={loadingUpdate}
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

export default UpdateKeyModal
