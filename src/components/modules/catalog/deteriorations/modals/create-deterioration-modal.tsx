import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import { useDeteriorations } from '../index/deterioration-context.js'
import Loader from '@ui/loader'
import { CreateDeterioration } from '@/lib/api/models/deterioration.js'
import { useState } from 'react'
import { addOneDay } from '@/components/ui/functions.js'

const CreateDeteriorationModal = () => {
  const { isCreateOpen, closeCreate, handleCreate, loadingCreate } = useDeteriorations()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateDeterioration>()


  const onSubmit = async (data: CreateDeterioration) => {
    await handleCreate(data)
    reset()
  }

  if (!isCreateOpen) return null

  return (
    <Modal visible onClose={closeCreate} className=" ">
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className=" text-xl md:text-2xl font-bold text-blue-600">
            Crear Deterioro
          </h2>
          <p className="text-sm">
            Ingresa los datos del deterioro que deseas registrar.
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
              placeholder="Nombre de la deterioro"
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

export default CreateDeteriorationModal
