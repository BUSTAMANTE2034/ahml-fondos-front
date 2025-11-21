import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import Loader from '@ui/loader'
import { useDeteriorations } from '../index/deterioration-context.js'
import { UpdateDeterioration } from '@/lib/api/models/deterioration.js'
import { useEffect } from 'react'

const UpdateDeteriorationModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useDeteriorations()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateDeterioration>()

  // Cargar datos
  useEffect(() => {
    if (selected) {
      reset({
        name: selected.name,
        description: selected.description || '',
      })
    }
  }, [selected, reset])

  const onSubmit = async (data: UpdateDeterioration) => {
    await handleUpdate(data)
    reset()
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal visible onClose={closeEdit} className=" ">
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className=" text-xl md:text-2xl font-bold text-blue-600">
            Editar Deterioro
          </h2>
          <p className="text-sm">
            Modifica los datos del deterioro seleccionado.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >

            <FormInput
              name="name"
              label="Nombre del deterioro"
              placeholder="Ingrese el nombre"
              register={register}
              errors={errors}
              rules={{ required: 'Nombre obligatorio' }}
            />

            <FormInput
              name="description"
              label="Descripción"
              placeholder="Ingrese la descripción"
              register={register}
              errors={errors}
              rules={{ required: 'Descripción obligatoria' }}
            />


          {/* BUTTONS */}
          {loadingUpdate ? (
            <div className="flex items-center justify-center mx-auto gap-4">
              <span className="text-blue-600 font-medium text-lg">
                Guardando...
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
                <span>Guardar</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  )
}

export default UpdateDeteriorationModal
