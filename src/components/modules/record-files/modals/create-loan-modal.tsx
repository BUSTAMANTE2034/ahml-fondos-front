import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import Loader from '@ui/loader'
import { CreateLoan } from '@/lib/api/models/loan.js'
import { useRecordFiles } from '../index/record-file-context.js'

const CreateLoanModal = () => {
  const {
    isCreateLoanOpen,
    closeCreateLoan,
    handleCreateLoan,
    loadingCreateLoan,
    selected,
  } = useRecordFiles()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateLoan>()

  const onSubmit = async (data: { description?: string | null }) => {
    if (!selected) return

    await handleCreateLoan({
      record_file_id: selected.id, // ← AQUÍ SE USA
      description: data.description ?? null,
    })

    reset()
  }

  if (!isCreateLoanOpen) return null

  return (
    <Modal visible onClose={closeCreateLoan} >
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className=" text-xl md:text-2xl font-bold text-blue-600">
            Realizar Préstamo
          </h2>
          <p className="text-sm">
            Ingresa la descripción del préstamo que deseas realizar.
          </p>
        </div>
        {/* INFORMACIÓN DEL EXPEDIENTE */}
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-light-gray border border-dark-gray">
          <h3 className="font-bold text-sm text-blue-600">
            Expediente a prestar
          </h3>

          <div className="flex flex-col text-xs">
            <span className="font-semibold">Código de clasificación:</span>
            <span className="text-tblack">{selected?.reference_code}</span>
          </div>

          <div className="flex flex-col text-xs mt-2">
            <span className="font-semibold">Número de expediente:</span>
            <span className="text-tblack">{selected?.file_number}</span>
          </div>

          <div className="flex flex-col text-xs mt-2">
            <span className="font-semibold">Estatus actual:</span>
            <span
              className={`${
                selected?.availability_status === 'available'
                  ? 'text-green-600'
                  : 'text-red-600'
              } font-medium`}
            >
              {selected?.availability_status === 'available'
                ? 'Disponible'
                : 'No disponible'}
            </span>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
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
          {loadingCreateLoan ? (
            <div className="flex items-center justify-center mx-auto gap-4">
              <span className="text-blue-600 font-medium text-lg">
                Creando...
              </span>
              <Loader size={20} />
            </div>
          ) : (
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={closeCreateLoan}
                className="cancel"
              >
                <span>Cancelar</span>
              </button>
              <button
                type="submit"
                className={`create ${
                  loadingCreateLoan ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loadingCreateLoan}
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

export default CreateLoanModal
