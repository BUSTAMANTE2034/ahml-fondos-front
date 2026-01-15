import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import { useBoxes } from '../index/box-context.js'
import Loader from '@ui/loader'
import { CreateBox } from '@/lib/api/models/box.js'
import { useState } from 'react'
import { addOneDay } from '@/components/ui/functions.js'
import { AsyncSearchSelect } from '../index/box-seach-select'
import { useSearchPhysicalLocations } from '@/lib/api/hooks/record-files/use-search-physical_locations'

const CreateBoxModal = () => {
  const { isCreateOpen, closeCreate, handleCreate, loadingCreate } = useBoxes()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateBox>()

  const onSubmit = async (data: CreateBox) => {
    await handleCreate(data)
    reset()
  }
const [locationQuery, setLocationQuery] = useState<string | undefined>(undefined)
  const {
  results: locationResults,
  loading: locationLoading,
  error: locationError,
} = useSearchPhysicalLocations(locationQuery, true)

  if (!isCreateOpen) return null

  return (
    <Modal visible onClose={closeCreate} className=" ">
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className=" text-xl md:text-2xl font-bold text-blue-600">
            Crear Caja
          </h2>
          <p className="text-sm">
            Ingresa los datos del ubicación que deseas registrar.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          <div className="flex flex-row gap-4">
            <FormInput
              className="w-full"
              name="box_number"
              label="Número de caja"
              placeholder="Número de caja"
              register={register}
              errors={errors}
              rules={{ required: 'Número de caja obligatorio' }}
            />
            <FormInput
              className="w-full"
              name="description"
              label="Descripción"
              placeholder="Descripción"
              register={register}
              errors={errors}
              rules={{ required: 'Descripción obligatoria' }}
            />
          </div>
          <div className="w-full grid grid-cols-1 gap-4 justify-between">
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


            
          </div>

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

export default CreateBoxModal
