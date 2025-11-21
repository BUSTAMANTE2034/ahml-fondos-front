import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import { useRecordFiles } from '../index/record-file-context'
import Loader from '@ui/loader'
import { CreateRecordFile } from '@/lib/api/models/record-file'
import FormCheckbox from '@/components/forms/checkbox'

import { AsyncSearchSelect } from '../index/record-file-seach-select'

import {
  useSearchFunds,
  useSearchSections,
  useSearchSeries,
  useSearchLocations,
  useSearchDeteriorations,
  useSearchTypologies,
} from '@hooks/record-files'

import { useState } from 'react'
import { Fund } from '@/lib/api/models/fund'
import { Section } from '@/lib/api/models/section'
import { Series } from '@/lib/api/models/series'
import { Location } from '@/lib/api/models/location'
import { Deterioration } from '@/lib/api/models/deterioration'
import { Typology } from '@/lib/api/models/typology'
import { AsyncCheckSearchSelect } from '../index/record-file-seach-check'
import TextArea from '@/components/forms/text-area'

const CreateRecordFileModal = () => {
  const { isCreateOpen, closeCreate, handleCreate, loadingCreate,errorCreate } =
    useRecordFiles()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateRecordFile>()

  // -----------------------------------------
  // ESTADOS PARA CADA ASYNC SELECT
  // -----------------------------------------
  const [fundQuery, setFundQuery] = useState('')
  const [sectionQuery, setSectionQuery] = useState('')
  const [seriesQuery, setSeriesQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [deteriorationQuery, setDeteriorationQuery] = useState('')
  const [typologyQuery, setTypologyQuery] = useState('')

  const { results: fundResults } = useSearchFunds(fundQuery)
  const { results: sectionResults } = useSearchSections(sectionQuery)
  const { results: seriesResults } = useSearchSeries(seriesQuery)
  const { results: locationResults } = useSearchLocations(locationQuery)
  const { results: deteriorationResults } =
    useSearchDeteriorations(deteriorationQuery)
  const { results: typologyResults } = useSearchTypologies(typologyQuery)

  // -----------------------------------------
  // SUBMIT
  // -----------------------------------------
const onSubmit = async (data: CreateRecordFile) => {
  try {
    await handleCreate(data)
    reset()   // solo si NO hubo error
  } catch {
    // hubo error → NO resetear
  }
}



  if (!isCreateOpen) return null

  return (
    <Modal visible onClose={closeCreate} showCloseButton={true} closeBackdrop={false}>
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Registrar Expediente
          </h2>
          <p className="text-sm">
            Ingresa los datos del expediente a registrar
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <FormInput
              name="file_number"
              type="number"
              label="Número de expediente"
              register={register}
              errors={errors}
              rules={{ required: 'Campo obligatorio' }}
            />

            <FormInput
              name="box_number"
              type="number"
              label="No.Caja"
              register={register}
              errors={errors}
              rules={{ required: 'Campo obligatorio' }}
            />

            <FormInput
              name="page_count"
              type="number"
              label="No.Hojas"
              register={register}
              errors={errors}
              rules={{ required: 'Campo obligatorio' }}
            />

            <FormInput
              name="file_date"
              type="date"
              label="Fecha del expediente"
              register={register}
              errors={errors}
              rules={{ required: 'Campo obligatorio' }}
            />

            <FormCheckbox
              name="sensitive_data"
              label="Información sensible"
              placeholder="Marcar si contiene datos delicados"
              register={register}
              error={errors?.sensitive_data?.message}
              rules={{}}
            />
            {/* -----------------------------------------
              SELECT: DETERIORO
          ----------------------------------------- */}
            <AsyncSearchSelect
              label="Deterioro"
              placeholder="Buscar deterioro..."
              value={null}
              error={errors.deterioration_status_id?.message}
              searchFn={async (q) => {
                setDeteriorationQuery(q)
                if (!q.trim()) return []
                return deteriorationResults.map((d: Deterioration) => ({
                  id: d.id,
                  label: d.name,
                }))
              }}
              onChange={(id) =>
                setValue('deterioration_status_id', id, {
                  shouldValidate: true,
                })
              }
            />
            <input type="hidden" {...register('deterioration_status_id', { required: 'Obligatorio' })} />
          </div>
          <div className="grid grid-cols-2  gap-4">
            {/* -----------------------------------------
              SELECT: FONDO
          ----------------------------------------- */}
            <AsyncSearchSelect
              label="Fondo"
              placeholder="Buscar fondo..."
              value={null}
              error={errors.fund_id?.message}
              searchFn={async (q) => {
                setFundQuery(q)
                if (!q.trim()) return []

                return fundResults.map((f: Fund) => ({
                  id: f.id,
                  label: `${f.acronym} - ${f.name}`,
                }))
              }}
              onChange={(id) =>
                setValue('fund_id', id, { shouldValidate: true })
              }
            />
            <input
              type="hidden"
              {...register('fund_id', { required: 'Obligatorio' })}
            />
            {/* -----------------------------------------
              SELECT: SECCIÓN
          ----------------------------------------- */}
            <AsyncSearchSelect
              label="Sección"
              placeholder="Buscar sección..."
              value={null}
              error={errors.section_id?.message}
              searchFn={async (q) => {
                setSectionQuery(q)
                if (!q.trim()) return []
                return sectionResults.map((s: Section) => ({
                  id: s.id,
                  label: `${s.acronym} - ${s.name}`,
                }))
              }}
              onChange={(id) =>
                setValue('section_id', id, { shouldValidate: true })
              }
            />
            <input type="hidden" {...register('section_id')} />
          </div>
          <div className="grid grid-cols-2  gap-4">
            {/* -----------------------------------------
              SELECT: SERIE
          ----------------------------------------- */}
            <AsyncSearchSelect
              label="Serie"
              placeholder="Buscar serie..."
              value={null}
              error={errors.series_id?.message}
              searchFn={async (q) => {
                setSeriesQuery(q)
                if (!q.trim()) return []
                return seriesResults.map((s: Series) => ({
                  id: s.id,
                  label: `${s.acronym} - ${s.name}`,
                }))
              }}
              onChange={(id) =>
                setValue('series_id', id, { shouldValidate: true })
              }
            />
            <input type="hidden" {...register('series_id')} />

            {/* -----------------------------------------
              SELECT: UBICACIÓN
          ----------------------------------------- */}
            <AsyncSearchSelect
              label="Ubicación"
              placeholder="Buscar ubicación..."
              value={null}
              error={errors.location_id?.message}
              searchFn={async (q) => {
                setLocationQuery(q)
                if (!q.trim()) return []
                return locationResults.map((l: Location) => ({
                  id: l.id,
                  label: l.name,
                }))
              }}
              onChange={(id) =>
                setValue('location_id', id, { shouldValidate: true })
              }
            />
            <input type="hidden" {...register('location_id')} />
          </div>

          {/* SUBJECT */}
          {/* SUBJECT (textarea primero) */}
          <TextArea
            label="Asunto"
            placeholder="Escribe un asunto breve..."
            maxLength={1500}
            {...register('subject', {
              required: 'Campo obligatorio',
              maxLength: {
                value: 1500,
                message: 'Máximo 1500 caracteres',
              },
            })}
            error={errors?.subject?.message}
          />
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            {/* -----------------------------------------
              SELECT: TIPOLOGÍAS (MÚLTIPLE OPCIONAL)
          ----------------------------------------- */}
            <AsyncCheckSearchSelect
              label="Tipologías"
              placeholder="Buscar tipo documental..."
              selectedIds={watch('typology_ids') || []}
              onChange={(ids) =>
                setValue('typology_ids', ids, { shouldValidate: true })
              }
              searchFn={async (q) => {
                setTypologyQuery(q)
                if (!q.trim()) return []

                return typologyResults.map((t) => ({
                  id: t.id,
                  label: t.name,
                }))
              }}
              error={errors.typology_ids?.message}
            />
            {/* COMMENTS (input después) */}
            <FormInput
              name="comments"
              type="text"
              label="Comentarios"
              placeholder="Escribe tus observaciones (opcional)"
              register={register}
              errors={errors}
              rules={{
                maxLength: {
                  value: 100,
                  message: 'Máximo 100 caracteres',
                },
              }}
            />
          </div>

          {/* BUTTONS */}
          {loadingCreate ? (
            <div className="flex items-center justify-center gap-4">
              <span className="text-blue-600 font-medium text-lg">
                Creando…
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
                className={`create ${loadingCreate ? 'opacity-50' : ''}`}
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

export default CreateRecordFileModal
