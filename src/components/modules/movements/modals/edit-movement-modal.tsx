import { useEffect } from 'react'
import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import Loader from '@ui/loader'

import { useMovements } from '../index/movement-context.js'
import { UpdateMovementHistory } from '@/lib/api/models/movement.js'
import { formatInputDate } from '@/components/ui/functions'
import { getAvailabilityLabel } from '@ui/functions'

// Estados reales permitidos
const STATUS_OPTIONS = [
  { value: "available", label: "Disponible / Archivo" },
  { value: "under_review", label: "En revisión / Preservación / Restauración" },
  { value: "unavailable", label: "No disponible" },
]

const UpdateMovementModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useMovements()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<UpdateMovementHistory>()

  // ==========================
  // Cargar datos al abrir modal
  // ==========================
  useEffect(() => {
    if (selected) {
      reset({
        description: selected.description || "",
        origin_status: selected.origin_status || null,
        destination_status: null,  // iniciar vacío
        moved_at: selected.moved_at ? formatInputDate(selected.moved_at) : "",
      })
    }
  }, [selected, reset])

  // ==========================
  // Enviar actualización
  // ==========================
  const onSubmit = async (data: UpdateMovementHistory) => {
    const payload: UpdateMovementHistory = {
      ...data,
      origin_status: selected?.origin_status || null,
      destination_status: data.destination_status || null,
    }

    // 🔥 Nunca enviar moved_at
    delete payload.moved_at

    await handleUpdate(payload)
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal visible onClose={closeEdit}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Editar Movimiento
          </h2>
          <p className="text-sm">
            Actualiza el estatus destino o la descripción. La fecha del movimiento no puede modificarse.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
          <div className="grid grid-cols-2 gap-4">

            {/* ORIGIN (readonly) */}
            <div className="flex flex-col">
              <label className="font-semibold text-xs">Estatus Origen</label>
              <input
                value={getAvailabilityLabel(selected.origin_status || "available")}
                readOnly
                className="border rounded-lg p-1 px-2 text-sm bg-blue-600 text-white cursor-not-allowed"
              />
            </div>

            {/* DESTINATION STATUS */}
            <div className="flex flex-col">
              <label className="font-semibold text-xs">Nuevo estatus *</label>
              <select
                {...register("destination_status", {
                  required: "El estatus destino es obligatorio",
                  validate: (v) =>
                    v !== selected.origin_status ||
                    "El estatus destino no puede ser igual al origen.",
                })}
                onChange={() => clearErrors("destination_status")}
                className="border rounded-lg p-1 px-2 text-xs"
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
            </div>
          </div>

          {/* MOVED_AT — SOLO LECTURA */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs">Fecha del movimiento</label>

            <input
              type="text"
              value={selected.moved_at ? formatInputDate(selected.moved_at) : ""}
              readOnly
              className="border rounded-lg p-2 text-sm bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col">
            <label className="font-semibold text-xs">Descripción *</label>
            <textarea
              {...register("description", { required: "La descripción es obligatoria" })}
              placeholder="Descripción del movimiento"
              className="border p-2 rounded-lg text-sm h-20"
            />
            {errors.description && (
              <span className="text-red-500 text-xs">
                {errors.description.message}
              </span>
            )}
          </div>

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

              <button type="submit" className="create">
                <span>Guardar cambios</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </Modal>
  )
}

export default UpdateMovementModal
