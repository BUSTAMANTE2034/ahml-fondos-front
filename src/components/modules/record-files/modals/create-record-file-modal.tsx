import Modal from '@ui/modal'
import { useForm, Controller } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import { useRecordFiles } from '../index/record-file-context'
import Loader from '@ui/loader'
import { CreateRecordFile } from '@/lib/api/models/record-file'
import FormCheckbox from '@/components/forms/checkbox'
import { DOCUMENT_SIZES } from '@/components/ui/functions'

import { AsyncSearchSelect } from '../index/record-file-seach-select'

import {
  useSearchFunds,
  useSearchSections,
  useSearchSeries,
  useSearchLocations,
  useSearchDeteriorations,
  useSearchTypologies,
} from '@hooks/record-files'

import { useEffect, useState } from 'react'

import { invertDate } from '@/components/ui/functions'
import TextArea from '@/components/forms/text-area'
import TextInput from '@/components/forms/text'
import { StaticCheckSearchSelect } from '../index/static-check-select'
import { AsyncCheckSearchSelect } from '../index/record-file-seach-check'

const CreateRecordFileModal = () => {
  const { isCreateOpen, closeCreate, handleCreate, loadingCreate } =
    useRecordFiles()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateRecordFile>()

  // -----------------------------------------
  // QUERIES PARA SELECTS
  // -----------------------------------------
  const [fundQuery, setFundQuery] = useState('')
  const [sectionQuery, setSectionQuery] = useState('')
  const [seriesQuery, setSeriesQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [deteriorationQuery, setDeteriorationQuery] = useState('')
  const [typologyQuery, setTypologyQuery] = useState('')

  // -----------------------------------------
  // HOOKS (fetch)
  // -----------------------------------------
  const { results: fundResults, loading: fundLoading, error: fundError } =
    useSearchFunds(fundQuery,true)
  const { results: sectionResults, loading: sectionLoading, error: sectionError } =
    useSearchSections(sectionQuery,true)
  const { results: seriesResults, loading: seriesLoading, error: seriesError } =
    useSearchSeries(seriesQuery,true)
  const {
    results: locationResults,
    loading: locationLoading,
    error: locationError,
  } = useSearchLocations(locationQuery,true)
  const {
    results: deteriorationResults,
    loading: deteriorationLoading,
    error: deteriorationError,
  } = useSearchDeteriorations(deteriorationQuery,true)
  const {
    results: typologyResults,
    loading: typologyLoading,
    error: typologyError,
  } = useSearchTypologies(typologyQuery,true)

  // -----------------------------------------
  // GENERACIÓN DE CÓDIGO ANTERIOR
  // -----------------------------------------
  const [prevFund, setPrevFund] = useState('')
  const [prevSection, setPrevSection] = useState('')
  const [prevSeries, setPrevSeries] = useState('')
  const [prevBox, setPrevBox] = useState('')
  const [prevExp, setPrevExp] = useState('')

  const previousReferenceCode = [
    prevFund || '',
    prevSection || '',
    prevSeries || '',
    prevBox ? `C.${prevBox}` : '',
    prevExp ? `Exp.${prevExp}` : '',
  ]
    .filter(Boolean)
    .join('-')

  useEffect(() => {
    setValue('previous_reference_code', previousReferenceCode)
  }, [previousReferenceCode, setValue])


  // -----------------------------------------
  // REGISTROS CORRECTOS (sin hidden inputs)
  // -----------------------------------------
  useEffect(() => {
    register('fund_id', { required: 'Selecciona un fondo.' })
    register('section_id', { required: 'Selecciona una sección.' })
    register('series_id', { required: 'Selecciona una serie.' })
    register('location_id', { required: 'Selecciona una ubicación.' })

    register('typology_ids', {
      required: 'Selecciona al menos una tipología.',
    })

    register('document_sizes', {
      required: 'Selecciona al menos un tamaño.',
    })

    register('previous_reference_code', {
      required: 'Debes generar una referencia anterior.',
    })
  }, [register])

  // -----------------------------------------
  // SUBMIT
  // -----------------------------------------
  const onSubmit = async (data: CreateRecordFile) => {
    try {
      await handleCreate(data)
      reset()
    } catch {}
  }

  if (!isCreateOpen) return null

  return (
    <Modal
      visible
      onClose={closeCreate}
      showCloseButton
      closeBackdrop={false}
      big
    >
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
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">

          {/* CAMPOS BÁSICOS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">

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

            <Controller
              name="sensitive_data"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormCheckbox
                  label="Información sensible"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  error={errors?.sensitive_data?.message}
                />
              )}
            />

            {/* DETERIORO */}
            <AsyncSearchSelect
              label="Deterioro"
              placeholder="Buscar deterioro…"
              value={watch('deterioration_status_id')??null}
              onChange={(id) =>
                setValue('deterioration_status_id', id, { shouldValidate: true })
              }
              onQueryChange={setDeteriorationQuery}
              results={deteriorationResults.map((d) => ({
                id: d.id,
                label: d.name,
              }))}
              loading={deteriorationLoading}
              searchError={deteriorationError}
              error={errors.deterioration_status_id?.message}
            />
          </div>

          {/* FONDO / SECCIÓN */}
          <div className="grid grid-cols-2 gap-4">
            <AsyncSearchSelect
              label="Fondo"
              placeholder="Buscar fondo…"
              value={watch('fund_id')??null}
              onChange={(id) => setValue('fund_id', id, { shouldValidate: true })}
              onQueryChange={setFundQuery}
              results={fundResults.map((f) => ({
                id: f.id,
                label: `${f.acronym} - ${f.name}`,
              }))}
              loading={fundLoading}
              searchError={fundError}
              error={errors.fund_id?.message}
            />

            <AsyncSearchSelect
              label="Sección"
              placeholder="Buscar sección…"
              value={watch('section_id')??null}
              onChange={(id) =>
                setValue('section_id', id, { shouldValidate: true })
              }
              onQueryChange={setSectionQuery}
              results={sectionResults.map((s) => ({
                id: s.id,
                label: `${s.acronym} - ${s.name}`,
              }))}
              loading={sectionLoading}
              searchError={sectionError}
              error={errors.section_id?.message}
            />
          </div>

          {/* SERIE / UBICACIÓN */}
          <div className="grid grid-cols-2 gap-4">
            <AsyncSearchSelect
              label="Serie"
              placeholder="Buscar serie…"
              value={watch('series_id')??null}
              onChange={(id) =>
                setValue('series_id', id, { shouldValidate: true })
              }
              onQueryChange={setSeriesQuery}
              results={seriesResults.map((s) => ({
                id: s.id,
                label: `${s.acronym} - ${s.name}`,
              }))}
              loading={seriesLoading}
              searchError={seriesError}
              error={errors.series_id?.message}
            />

            <AsyncSearchSelect
              label="Ubicación"
              placeholder="Buscar ubicación…"
              value={watch('location_id')??null}
              onChange={(id) =>
                setValue('location_id', id, { shouldValidate: true })
              }
              onQueryChange={setLocationQuery}
              results={locationResults.map((l) => ({
                id: l.id,
                label: l.name,
              }))}
              loading={locationLoading}
              searchError={locationError}
              error={errors.location_id?.message}
            />
          </div>

          {/* ASUNTO */}
          <TextArea
            label="Asunto"
            placeholder="Escribe un asunto breve…"
            maxLength={1500}
            {...register('subject', {
              required: 'Campo obligatorio',
              maxLength: { value: 1500, message: 'Máximo 1500 caracteres' },
            })}
            error={errors?.subject?.message}
          />

          {/* TIPOLOGÍAS Y TAMAÑOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* TIPOS */}
            <AsyncCheckSearchSelect
              label="Tipologías"
              placeholder="Buscar tipo..."
              selectedIds={watch('typology_ids') || []}
              onChange={(ids) =>
                setValue('typology_ids', ids, { shouldValidate: true })
              }
              onQueryChange={setTypologyQuery}
              results={typologyResults.map((t) => ({
                id: t.id,
                label: t.name,
              }))}
              loading={typologyLoading}
              searchError={typologyError}
              error={errors.typology_ids?.message}
            />

            {/* TAMAÑOS */}
            <StaticCheckSearchSelect
              label="Tamaños del documento"
              options={DOCUMENT_SIZES}
              selectedIds={watch('document_sizes')?.split(',') ?? []}
              onChange={(ids) =>
                setValue('document_sizes', ids.join(','), {
                  shouldValidate: true,
                })
              }
              error={errors.document_sizes?.message}
            />
          </div>

          {/* COMENTARIOS */}
          <FormInput
            name="comments"
            type="text"
            label="Comentarios"
            placeholder="Observaciones (opcional)"
            register={register}
            errors={errors}
            rules={{
              maxLength: { value: 100, message: 'Máximo 100 caracteres' },
            }}
          />

          {/* REFERENCIA ANTERIOR */}
          <div className="border border-dark-gray2 rounded-3xl p-4 mt-2 space-y-4 bg-main-gray text-center">
            <h3 className="text-lg font-semibold text-blue-600">
              Referencia anterior
            </h3>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
              <TextInput
                className="text-center border-dark-gray2 border rounded-3xl bg-white font-medium text-blue-600"
                label="Fondo"
                value={prevFund}
                onChange={(e) => setPrevFund(e.target.value)}
                toUpper
              />

              <TextInput
                className="text-center border-dark-gray2 border rounded-3xl bg-white font-medium text-blue-600"
                label="Sección"
                value={prevSection}
                onChange={(e) => setPrevSection(e.target.value)}
                toUpper
              />

              <TextInput
                className="text-center border-dark-gray2 border rounded-3xl bg-white font-medium text-blue-600"
                label="Serie"
                value={prevSeries}
                onChange={(e) => setPrevSeries(e.target.value)}
                toUpper
              />

              <TextInput
                className="text-center border-dark-gray2 border rounded-3xl bg-white font-medium text-blue-600"
                label="No.Caja"
                type="number"
                value={prevBox}
                onChange={(e) => setPrevBox(e.target.value)}
              />

              <TextInput
                className="text-center border-dark-gray2 border rounded-3xl bg-white font-medium text-blue-600"
                label="No.Exp"
                type="number"
                value={prevExp}
                onChange={(e) => setPrevExp(e.target.value)}
              />
            </div>

            <div className="px-3 py-1 border border-blue-600 rounded-3xl bg-white">
              <p className="text-sm text-gray-700">Código generado:</p>
              <p className="font-bold text-red text-base">
                {previousReferenceCode || '—'}
              </p>
            </div>
          </div>

          {/* ERROR GLOBAL visible */}
          {errors.previous_reference_code && (
            <p className="text-red-600 text-xs">
              Debes generar una referencia anterior antes de guardar.
            </p>
          )}

          {/* BUTTONS */}
          {loadingCreate ? (
            <div className="flex justify-center items-center gap-4">
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

export default CreateRecordFileModal
