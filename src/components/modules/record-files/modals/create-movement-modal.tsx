import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import Loader from '@ui/loader'
import { useRecordFiles } from '../index/record-file-context'
import { CreateMovementHistory } from '@/lib/api/models/movement'
import {getAvailabilityLabel}from '@ui/functions'

// Estados permitidos del expediente (los del backend)
const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible/Archivo' },
  { value: 'under_review', label: 'En revisión/preservación/restauración' },
  { value: 'unavailable', label: 'No disponible' },
]

const CreateMovementModal = () => {
  const {
    isCreateMovementOpen,
    closeCreateMovement,
    handleCreateMovement,
    loadingCreateMovement,
    selected,
  } = useRecordFiles()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    clearErrors,
  } = useForm<CreateMovementHistory>()

  if (!isCreateMovementOpen || !selected) return null

  const rf = selected
  const originStatus = rf.availability_status
  const destValue = watch('destination_status')

  // ----------------------------
  // SUBMIT
  // ----------------------------
  const onSubmit = async (data: CreateMovementHistory) => {
    if (data.destination_status === originStatus) {
      setError('destination_status', {
        message: 'El estatus destino no puede ser igual al origen.',
      })
      return
    }

    const payload: CreateMovementHistory = {
      record_file_id: rf.id,
      destination_status: data.destination_status!,
      description: data.description!,
    }

    await handleCreateMovement(payload)
    reset()
  }

  return (
    <Modal visible onClose={closeCreateMovement} className=" ">
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Registrar Movimiento
          </h2>
          <p className="text-sm">
            Ingresa la nueva disponibilidad del expediente.
          </p>
        </div>

        {/* EXPEDIENTE */}
        <div className="flex flex-col gap-1 p-3 rounded-xl bg-light-gray border border-dark-gray">
          <h3 className="font-bold text-sm text-blue-600">Expediente</h3>

          <div className="flex flex-col text-xs">
            <span className="font-semibold">Código:</span>
            <span>{rf.reference_code}</span>
          </div>

          <div className="flex flex-col text-xs mt-2">
            <span className="font-semibold">Número de expediente:</span>
            <span>{rf.file_number}</span>
          </div>

          <div className="flex flex-col text-xs mt-2">
            <span className="font-semibold">Estado actual:</span>
            <span className="font-medium text-blue-600">
              {getAvailabilityLabel(rf.availability_status)}
            </span>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
                    <div className="grid grid-cols-2  gap-4"> {/* ORIGIN (solo lectura) */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs">Estatus Origen</label>
            <input
              value={getAvailabilityLabel(originStatus)}
              readOnly
              className="border rounded-lg p-1 px-2 text-sm bg-blue-600 text-white hover:bg-blue-500 cursor-not-allowed"
            />
          </div>

          {/* DESTINATION STATUS */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs">Nuevo estatus *</label>

            <select
              {...register('destination_status', {
                required: 'El estatus destino es obligatorio',
                validate: (value) =>
                  value !== originStatus ||
                  'El estatus destino no puede ser igual al origen.',
              })}
              onChange={() => clearErrors('destination_status')}
              className="border rounded-lg p-1 px-2  text-xs"
            >
              <option value="">Selecciona…</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {errors.destination_status && (
              <span className="text-red-500 text-xs">
                {errors.destination_status.message}
              </span>
            )}
          </div></div>

         

          {/* DESCRIPTION */}
          <FormInput
            name="description"
            label="Descripción *"
            placeholder="Descripción del movimiento"
            register={register}
            errors={errors}
            rules={{ required: 'La descripción es obligatoria' }}
          />

          {/* BUTTONS */}
          {loadingCreateMovement ? (
            <div className="flex items-center justify-center mx-auto gap-4">
              <span className="text-blue-600 font-medium text-lg">
                Creando...
              </span>
              <Loader size={20} />
            </div>
          ) : (
            <div className="flex justify-end gap-4 pt-4">
              <button type="button" onClick={closeCreateMovement} className="cancel">
                <span>Cancelar</span>
              </button>

              <button type="submit" className="create">
                <span>Guardar</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  )
}

export default CreateMovementModal
