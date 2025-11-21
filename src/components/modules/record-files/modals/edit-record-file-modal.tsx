import { useEffect, useState } from 'react'
import Modal from '@ui/modal'
import { useForm } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import TextArea from '@/components/forms/text-area'
import FormCheckbox from '@/components/forms/checkbox'
import Loader from '@ui/loader'

import { useRecordFiles } from '../index/record-file-context'
import { UpdateRecordFile } from '@/lib/api/models/record-file'

import { AsyncSearchSelect } from '../index/record-file-seach-select'
import { AsyncCheckSearchSelect } from '../index/record-file-seach-check'

import {
  useSearchFunds,
  useSearchSections,
  useSearchSeries,
  useSearchLocations,
  useSearchDeteriorations,
  useSearchTypologies,
} from '@hooks/record-files'

import { Fund } from '@/lib/api/models/fund'
import { Section } from '@/lib/api/models/section'
import { Series } from '@/lib/api/models/series'
import { Location } from '@/lib/api/models/location'
import { Deterioration } from '@/lib/api/models/deterioration'
import { Typology } from '@/lib/api/models/typology'

const UpdateRecordFileModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useRecordFiles()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateRecordFile>()

  // ===============================
  // QUERIES PARA ASYNC SELECT
  // ===============================
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

  // ===============================
  // PRE-CARGA DE DATOS
  // ===============================
  useEffect(() => {
    if (selected) {
      reset({
        subject: selected.subject,
        file_number: selected.file_number,
        box_number: selected.box_number,
        page_count: selected.page_count,
        file_date: selected.file_date,
        last_fund_date: selected.last_fund_date,
        last_preservation_date: selected.last_preservation_date,
        sensitive_data: selected.sensitive_data,
        comments: selected.comments,
        availability_status: selected.availability_status,

        fund_id: selected.fund_id,
        section_id: selected.section_id,
        series_id: selected.series_id,
        location_id: selected.location_id,
        deterioration_status_id: selected.deterioration_status_id,

        typology_ids: selected.typologies?.map((t) => t.id) || [],
      })
    }
  }, [selected, reset])

  // ===============================
  // SUBMIT
  // ===============================
  const onSubmit = async (data: UpdateRecordFile) => {
    await handleUpdate({ ...data })
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal visible onClose={closeEdit} showCloseButton={true} closeBackdrop={false}>
      <div className="flex flex-col gap-4 px-2 md:px-4">

        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Editar Expediente
          </h2>
          <p className="text-sm">Modifica los datos del expediente.</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">

          {/* GRID GENERAL */}
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
              register={register}
              error={errors?.sensitive_data?.message}
            />

            {/* DETERIORO */}
            <AsyncSearchSelect
              label="Deterioro"
              placeholder="Buscar deterioro..."
              value={selected.deterioration_status_id}
              initialLabel={selected.deterioration_status?.name}
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
            <input type="hidden" {...register('deterioration_status_id')} />
          </div>

          {/* 2da fila: Fondo / Sección */}
          <div className="grid grid-cols-2 gap-4">

            <AsyncSearchSelect
              label="Fondo"
              placeholder="Buscar fondo..."
              value={selected.fund_id}
              initialLabel={
                selected.fund ? `${selected.fund.acronym} - ${selected.fund.name}` : ''
              }
              error={errors.fund_id?.message}
              searchFn={async (q) => {
                setFundQuery(q)
                if (!q.trim()) return []
                return fundResults.map((f: Fund) => ({
                  id: f.id,
                  label: `${f.acronym} - ${f.name}`,
                }))
              }}
              onChange={(id) => setValue('fund_id', id, { shouldValidate: true })}
            />
            <input type="hidden" {...register('fund_id')} />

            <AsyncSearchSelect
              label="Sección"
              placeholder="Buscar sección..."
              value={selected.section_id}
              initialLabel={
                selected.section ? `${selected.section.acronym} - ${selected.section.name}` : ''
              }
              error={errors.section_id?.message}
              searchFn={async (q) => {
                setSectionQuery(q)
                if (!q.trim()) return []
                return sectionResults.map((s: Section) => ({
                  id: s.id,
                  label: `${s.acronym} - ${s.name}`,
                }))
              }}
              onChange={(id) => setValue('section_id', id, { shouldValidate: true })}
            />
            <input type="hidden" {...register('section_id')} />
          </div>

          {/* 3ra fila: Serie / Ubicación */}
          <div className="grid grid-cols-2 gap-4">

            <AsyncSearchSelect
              label="Serie"
              placeholder="Buscar serie..."
              value={selected.series_id}
              initialLabel={
                selected.series ? `${selected.series.acronym} - ${selected.series.name}` : ''
              }
              error={errors.series_id?.message}
              searchFn={async (q) => {
                setSeriesQuery(q)
                if (!q.trim()) return []
                return seriesResults.map((s: Series) => ({
                  id: s.id,
                  label: `${s.acronym} - ${s.name}`,
                }))
              }}
              onChange={(id) => setValue('series_id', id, { shouldValidate: true })}
            />
            <input type="hidden" {...register('series_id')} />

            <AsyncSearchSelect
              label="Ubicación"
              placeholder="Buscar ubicación..."
              value={selected.location_id}
              initialLabel={selected.location?.name}
              error={errors.location_id?.message}
              searchFn={async (q) => {
                setLocationQuery(q)
                if (!q.trim()) return []
                return locationResults.map((l: Location) => ({
                  id: l.id,
                  label: l.name,
                }))
              }}
              onChange={(id) => setValue('location_id', id, { shouldValidate: true })}
            />
            <input type="hidden" {...register('location_id')} />
          </div>

          {/* SUBJECT */}
          <TextArea
            label="Asunto"
            placeholder="Escribe un asunto breve..."
            maxLength={1500}
            defaultValue={selected.subject}
            {...register('subject', {
              required: 'Campo obligatorio',
              maxLength: {
                value: 1500,
                message: 'Máximo 1500 caracteres',
              },
            })}
            error={errors?.subject?.message}
          />

          {/* TYPOLOGÍAS + COMMENTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                return typologyResults.map((t: Typology) => ({
                  id: t.id,
                  label: t.name,
                }))
              }}
              error={errors.typology_ids?.message}
            />

            <FormInput
              name="comments"
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
                className={`create ${loadingUpdate ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default UpdateRecordFileModal
