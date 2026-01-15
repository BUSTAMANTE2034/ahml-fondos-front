import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import Loader from '@ui/loader'
import { useBoxes } from '../index/box-context.js'
import { UpdateBox } from '@/lib/api/models/box.js'
import { useEffect, useState } from 'react'
import { AsyncSearchSelect } from '../index/box-seach-select'
import { useSearchPhysicalLocations } from '@/lib/api/hooks/record-files/use-search-physical_locations'

const UpdateBoxModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useBoxes()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateBox>()

  // -----------------------------
  // QUERY PARA UBICACIONES
  // -----------------------------
  const [locationQuery, setLocationQuery] = useState<string | undefined>(undefined)

  const {
    results: locationResults,
    loading: locationLoading,
    error: locationError,
  } = useSearchPhysicalLocations(locationQuery, true)

  // -----------------------------
  // REGISTRO MANUAL
  // -----------------------------
  useEffect(() => {
    register('physical_location_id', {
      required: 'La ubicación física es obligatoria',
    })
  }, [register])

  // -----------------------------
  // CARGAR DATOS SELECCIONADOS
  // -----------------------------
  useEffect(() => {
    if (selected) {
      reset({
        box_number: selected.box_number,
        description: selected.description,
        physical_location_id: selected.physical_location_id,
      })
    }
  }, [selected, reset])

  // -----------------------------
  // SUBMIT
  // -----------------------------
  const onSubmit = async (data: UpdateBox) => {
    await handleUpdate(data)
    reset()
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal visible onClose={closeEdit}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Editar Caja
          </h2>
          <p className="text-sm">
            Modifica los datos de la caja seleccionada.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-3"
        >
          <FormInput
            name="box_number"
            label="Número de Caja"
            placeholder="Ingrese el número de caja"
            register={register}
            errors={errors}
            rules={{ required: 'Número de caja obligatorio' }}
          />

          <FormInput
            name="description"
            label="Descripción"
            placeholder="Ingrese la descripción"
            register={register}
            errors={errors}
            rules={{ required: 'Descripción obligatoria' }}
          />

          {/* UBICACIÓN FÍSICA */}
          <AsyncSearchSelect
            label="Ubicación física"
            placeholder="Buscar ubicación…"
            value={watch('physical_location_id') ?? null}
            onChange={(id) =>
              setValue('physical_location_id', id, { shouldValidate: true })
            }
            onQueryChange={setLocationQuery}
            results={locationResults.map((l) => ({
              id: l.id,
              label: `${l.code}${l.description ? ` — ${l.description}` : ''}`,
            }))}
            loading={locationLoading}
            searchError={locationError}
            error={errors.physical_location_id?.message}
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

export default UpdateBoxModal
