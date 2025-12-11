import { useEffect, useState } from 'react'
import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import Loader from '@ui/loader'
import { useSeries } from '../index/series-context.js'
import { UpdateSeries } from '@/lib/api/models/series.js'
import { AsyncSearchSelect } from '../index/series-seach-select.js'
import { useSearchCatalogKeys } from '@/lib/api/hooks/catalog/series/use-search-catalog_key.js'
import { addOneDay } from '@/components/ui/functions.js'

const UpdateSeriesModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useSeries()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateSeries>()

  const startDate = watch('start_date')

  const [keyQuery, setKeyQuery] = useState('')
  const { results: keyResults } = useSearchCatalogKeys(keyQuery)

  // Cargar los datos del serie seleccionado
  useEffect(() => {
    if (selected) {
      reset({
        name: selected.name,
        acronym: selected.acronym,
        start_date: selected.start_date,
        end_date: selected.end_date,
        catalog_key_id: selected.catalog_key_id,
      })
    }
  }, [selected, reset])

  const onSubmit = async (data: UpdateSeries) => {
    await handleUpdate({ ...data, catalog_key_id: selected?.catalog_key_id })
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal visible onClose={closeEdit} className=" ">
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Editar Serie
          </h2>
          <p className="text-sm">Modifica los datos de la serie.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-2">

          {/* NAME + ACRONYM */}
          <div className="w-full grid grid-cols-2 gap-4">
            <FormInput
              name="name"
              label="Nombre del serie"
              placeholder="Nombre del serie"
              register={register}
              errors={errors}
              rules={{ required: "Nombre obligatorio" }}
            />

            <FormInput
              name="acronym"
              label="Sigla"
              toUpper={true}
              placeholder="Ingrese la sigla"
              register={register}
              errors={errors}
              rules={{ required: "Sigla obligatorio" }}
            />
          </div>

          {/* DATES */}
          <div className="w-full grid grid-cols-2 gap-4">
            {/* Start */}
            <FormInput
              name="start_date"
              label="Fecha Inicio"
              type="date"
              register={register}
              errors={errors}
              rules={{ required: "Fecha inicio obligatoria" }}
            />

            {/* End */}
            <FormInput
              name="end_date"
              label="Fecha Fin"
              type="date"
              register={register}
              disabled={!startDate}
              errors={errors}
              rules={{
                required: "Fecha de término obligatoria",
                validate: (value) => {
                  const start = startDate ?? ""
                  const end = value ?? ""

                  if (!start) return "Selecciona primero la fecha de inicio"
                  if (!end) return "La fecha de fin es obligatoria"
                  if (end < start) return "La fecha de fin debe ser mayor que la de inicio"

                  return true
                }
              }}
              min={addOneDay(startDate)}
            />
          </div>

          {/* CATALOG KEY SELECT */}
          <AsyncSearchSelect
            label="Clave del Catálogo"
            placeholder="Ingrese la clave o nombre"
            value={selected.catalog_key_id}
            initialLabel={`${selected.catalog_key?.key} - ${selected.catalog_key?.name}`}  
            error={errors.catalog_key_id?.message}
            searchFn={async (q) => {
              setKeyQuery(q)
              if (!q.trim()) return []

              return new Promise((resolve) => {
                setTimeout(() => {
                  resolve(
                    keyResults.map((k) => ({
                      id: k.id,
                      label: `${k.key} - ${k.name}`,
                    }))
                  )
                }, 10)
              })
            }}
            onChange={(id) =>
              setValue("catalog_key_id", id, { shouldValidate: true })
            }
          />

          <input
            type="hidden"
            {...register("catalog_key_id", {
              required: "La clave del catálogo es obligatoria",
            })}
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

export default UpdateSeriesModal
