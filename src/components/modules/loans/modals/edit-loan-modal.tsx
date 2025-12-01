import { useEffect, useState } from 'react'
import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import Loader from '@ui/loader'
import { useLoans } from '../index/loan-context.js'
import { UpdateLoan } from '@/lib/api/models/loan.js'
import { addOneDay } from '@/components/ui/functions.js'

const UpdateLoanModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useLoans()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateLoan>()



  // Cargar los datos del fondo seleccionado
  useEffect(() => {
    if (selected) {
      reset({
        
        description: selected.description,
      })
    }
  }, [selected, reset])

  const onSubmit = async (data: UpdateLoan) => {
    await handleUpdate({ ...data,  })
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal visible onClose={closeEdit} className=" ">
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Editar Descripción 
          </h2>
          <p className="text-sm">Modifica la descripción del prestamo.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">

          {/* NAME + ACRONYM */}
             <FormInput
              name="description"
              label="Descripción"
              placeholder="Descripción"
              register={register}
              errors={errors}
              rules={{ required: 'Aescripción obligatoria' }}
            />
            

  

          
          {/* BUTTONS */}
          {loadingUpdate ? (
            <div className="flex items-center justify-center mx-auto gap-4">
              <span className="text-blue-600 font-medium text-lg">
                Guardando cambios...
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
                className={`create ${loadingUpdate ? "opacity-50 cursor-not-allowed" : ""}`}
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

export default UpdateLoanModal
