import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import { useSections } from '../index/section-context.js'
import Loader from '@ui/loader'
import { CreateSection } from '@/lib/api/models/section.js'
import { AsyncSearchSelect } from '../index/section-seach-select.js'
import { useSearchCatalogKeys } from '@/lib/api/hooks/catalog/sections/use-search-catalog_key.js'
import { useState } from 'react'
import { addOneDay } from '@/components/ui/functions.js'

const CreateSectionModal = () => {
  const { isCreateOpen, closeCreate, handleCreate, loadingCreate } = useSections()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateSection>()

  const startDate = watch('start_date') // ⭐ Para validar la fecha final

 const [keyQuery, setKeyQuery] = useState<string | undefined>(undefined)

const {
  results: keyResults,
  loading: keyLoading,
  error: keyError,
} = useSearchCatalogKeys(keyQuery, true)


  const onSubmit = async (data: CreateSection) => {
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
            Crear Sección
          </h2>
          <p className="text-sm">
            Ingresa los datos del sección que deseas registrar.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
        >
          {/* NAME + ACRONYM */}
          <div className="w-full grid grid-cols-2 justify-between gap-4">
            <FormInput
              name="name"
              label="Nombre de la Sección"
              placeholder="Nombre de la sección"
              register={register}
              errors={errors}
              rules={{ required: 'Nombre obligatorio' }}
            />

            <FormInput
              name="acronym"
              label="Sigla"
              
              placeholder="Ingrese la sigla"
              register={register}
              errors={errors}
              rules={{ required: 'Sigla obligatorio' }}
              toUpper={true}
            />
          </div>

          {/* DATES */}
          <div className="w-full grid grid-cols-2 gap-4 justify-between">
            {/* FECHA INICIO */}
            <FormInput
              name="start_date"
              label="Fecha Inicio"
              type="date"
              register={register}
              errors={errors}
              rules={{
                required: 'Fecha inicio obligatoria',
              }}
            />

            {/* FECHA FIN */}
            <FormInput
              name="end_date"
              label="Fecha Fin"
              type="date"
              register={register}
              disabled={!startDate}
              errors={errors}
              rules={{
                required: 'Fecha de término obligatoria',
                validate: (value) => {
                  const start = startDate ?? ''
                  const end = value ?? ''

                  if (!start) return 'Selecciona primero la fecha de inicio'
                  if (!end) return 'La fecha de fin es obligatoria'
                  if (end < start)
                    return 'La fecha de fin debe ser mayor o igual que la de inicio'

                  return true
                },
              }}
              min={addOneDay(startDate)}
            />
          </div>

          {/* CATALOG KEY SELECT */}
          <div className="w-full grid grid-cols-1 gap-4 justify-between">
            <AsyncSearchSelect
  label="Clave del Catálogo"
  placeholder="Buscar clave del catálogo…"
  value={watch('catalog_key_id') ?? null}
  onChange={(id) =>
    setValue('catalog_key_id', id, { shouldValidate: true })
  }
  onQueryChange={setKeyQuery}
  results={keyResults.map((k) => ({
    id: k.id,
    label: `${k.key} — ${k.name}`,
  }))}
  loading={keyLoading}
  searchError={keyError}
  error={errors.catalog_key_id?.message}
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

export default CreateSectionModal
