import Modal from '@ui/modal'
import { useForm, Controller } from 'react-hook-form'
import { FormInput } from '@/components/forms/input'
import { useRecordFiles } from '../index/record-file-context'
import Loader from '@ui/loader'
import { CreateRecordFile } from '@/lib/api/models/record-file'
import FormCheckbox from '@/components/forms/checkbox'
import { DOCUMENT_SIZES, isDateBeforeOrToday } from '@/components/ui/functions'

import { AsyncSearchSelect } from '../index/record-file-seach-select'

import {
  useSearchFunds,
  useSearchSections,
  useSearchSeries,
  useSearchLocations,
  useSearchDeteriorations,
  useSearchTypologies,
  useSearchBoxes,
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
  } = useForm<CreateRecordFile>({
    shouldUnregister: true,
    defaultValues: {
      box_id: null,
      fund_id: null,
      section_id: null,
      series_id: null,
      location_id: null,
      deterioration_status_id: null,
      typology_ids: [],
      document_sizes: '',
      sensitive_data: false,
    },
  })
  const resetForm = () => {
    reset({
      box_id: null,
      fund_id: null,
      section_id: null,
      series_id: null,
      location_id: null,
      deterioration_status_id: null,
      typology_ids: [],
      document_sizes: '',
      sensitive_data: false,
      previous_reference_code: '',
    })

    resetReference()
  }

  // -----------------------------------------
  // QUERIES PARA SELECTS
  // ----------------------------------------
  //
  const [boxQuery, setBoxQuery] = useState<string | undefined>(undefined)
  const [fundQuery, setFundQuery] = useState<string | undefined>(undefined)
  const [sectionQuery, setSectionQuery] = useState<string | undefined>(
    undefined,
  )
  const [seriesQuery, setSeriesQuery] = useState<string | undefined>(undefined)
  const [locationQuery, setLocationQuery] = useState<string | undefined>(
    undefined,
  )
  const [deteriorationQuery, setDeteriorationQuery] = useState<
    string | undefined
  >(undefined)
  const [typologyQuery, setTypologyQuery] = useState<string | undefined>(
    undefined,
  )

  // -----------------------------------------
  // HOOKS (fetch)
  // -----------------------------------------
  const {
    results: boxResults,
    loading: boxLoading,
    error: boxError,
  } = useSearchBoxes(boxQuery, true)
  const {
    results: fundResults,
    loading: fundLoading,
    error: fundError,
  } = useSearchFunds(fundQuery, true)
  const {
    results: sectionResults,
    loading: sectionLoading,
    error: sectionError,
  } = useSearchSections(sectionQuery, true)
  const {
    results: seriesResults,
    loading: seriesLoading,
    error: seriesError,
  } = useSearchSeries(seriesQuery, true)
  const {
    results: locationResults,
    loading: locationLoading,
    error: locationError,
  } = useSearchLocations(locationQuery, true)
  const {
    results: deteriorationResults,
    loading: deteriorationLoading,
    error: deteriorationError,
  } = useSearchDeteriorations(deteriorationQuery, true)
  const {
    results: typologyResults,
    loading: typologyLoading,
    error: typologyError,
  } = useSearchTypologies(typologyQuery, true)

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
    setValue('previous_reference_code', previousReferenceCode,{
    shouldValidate: true,
  })
  }, [previousReferenceCode, setValue])

  // -----------------------------------------
  // REGISTROS CORRECTOS (sin hidden inputs)
  // -----------------------------------------
  // useEffect(() => {
  //   register('box_id', { required: 'Selecciona una caja.' })
  //   register('fund_id', { required: 'Selecciona un fondo.' })
  //   register('section_id', { required: 'Selecciona una sección.' })
  //   register('series_id', { required: 'Selecciona una serie.' })
  //   register('location_id', { required: 'Selecciona una ubicación.' })
  //   register('deterioration_status_id', {
  //     required: 'Selecciona el estado de deterioro.',
  //   })

  //   register('typology_ids', {
  //     required: 'Selecciona al menos una tipología.',
  //   })

  //   register('document_sizes', {
  //     required: 'Selecciona al menos un tamaño.',
  //   })

  //   register('previous_reference_code', {
  //     required: 'Debes generar una referencia anterior.',
  //   })
  // }, [register])

  const resetReference = () => {
    setPrevFund('')
    setPrevSection('')
    setPrevSeries('')
    setPrevBox('')
    setPrevExp('')
  }

  // -----------------------------------------
  // SUBMIT
  // -----------------------------------------
  const onSubmit = async (data: CreateRecordFile) => {
    try {
      await handleCreate(data)
      // reset()
      resetForm()
      // resetReference()
    } catch {}
  }

  if (!isCreateOpen) return null

  return (
    <Modal
      visible
      onClose={() => {
        // reset()
        resetForm()
        closeCreate()
      }}
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          {/* CAMPOS BÁSICOS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
            {/* <FormInput
              name="file_number"
              label="Número de expediente"
              register={register}
              errors={errors}
              rules={{ required: 'Campo obligatorio' }}
            /> */}

            <Controller
              name="box_id"
              control={control}
              rules={{ required: 'Selecciona una caja.' }}
              render={({ field }) => (
                <AsyncSearchSelect
                  label="Caja"
                  placeholder="Buscar caja…"
                  value={field.value}
                  onChange={field.onChange}
                  onQueryChange={setBoxQuery}
                  results={boxResults.map((b) => ({
                    id: b.id,
                    label: `${b.box_number}`,
                  }))}
                  loading={boxLoading}
                  error={errors.box_id?.message}
                />
              )}
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
              max={new Date().toISOString().split('T')[0]} // <-- OK
              rules={{
                required: 'Campo obligatorio',
                validate: {
                  notFuture: (value) =>
                    (value && isDateBeforeOrToday(String(value))) ||
                    'La fecha no puede ser mayor a hoy.',
                },
              }}
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
            <Controller
              name="deterioration_status_id"
              control={control}
              rules={{ required: 'Selecciona el estado de deterioro.' }}
              render={({ field }) => (
                <AsyncSearchSelect
                  label="Deterioro"
                  placeholder="Buscar deterioro…"
                  value={field.value}
                  onChange={field.onChange}
                  onQueryChange={setDeteriorationQuery}
                  results={deteriorationResults.map((d) => ({
                    id: d.id,
                    label: d.name,
                  }))}
                  loading={deteriorationLoading}
                  searchError={deteriorationError}
                  error={errors.deterioration_status_id?.message}
                />
              )}
            />
          </div>

          {/* FONDO / SECCIÓN */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="fund_id"
              control={control}
              rules={{ required: 'Selecciona un fondo.' }}
              render={({ field }) => (
                <AsyncSearchSelect
                  label="Fondo"
                  placeholder="Buscar fondo…"
                  value={field.value}
                  onChange={field.onChange}
                  onQueryChange={setFundQuery}
                  results={fundResults.map((f) => ({
                    id: f.id,
                    label: `${f.acronym} — ${f.name}`,
                  }))}
                  loading={fundLoading}
                  searchError={fundError}
                  error={errors.fund_id?.message}
                />
              )}
            />

            <Controller
              name="section_id"
              control={control}
              rules={{ required: 'Selecciona una sección.' }}
              render={({ field }) => (
                <AsyncSearchSelect
                  label="Sección"
                  placeholder="Buscar sección…"
                  value={field.value}
                  onChange={field.onChange}
                  onQueryChange={setSectionQuery}
                  results={sectionResults.map((s) => ({
                    id: s.id,
                    label: `${s.acronym} — ${s.name}`,
                  }))}
                  loading={sectionLoading}
                  searchError={sectionError}
                  error={errors.section_id?.message}
                />
              )}
            />
          </div>

          {/* SERIE / UBICACIÓN */}
          <div className="grid grid-cols-2 gap-4">
            <Controller
              name="series_id"
              control={control}
              rules={{ required: 'Selecciona una serie.' }}
              render={({ field }) => (
                <AsyncSearchSelect
                  label="Serie"
                  placeholder="Buscar serie…"
                  value={field.value}
                  onChange={field.onChange}
                  onQueryChange={setSeriesQuery}
                  results={seriesResults.map((s) => ({
                    id: s.id,
                    label: `${s.acronym} — ${s.name}`,
                  }))}
                  loading={seriesLoading}
                  searchError={seriesError}
                  error={errors.series_id?.message}
                />
              )}
            />

            <Controller
              name="location_id"
              control={control}
              rules={{ required: 'Selecciona una ubicación.' }}
              render={({ field }) => (
                <AsyncSearchSelect
                  label="Localidad"
                  placeholder="Buscar ubicación…"
                  value={field.value}
                  onChange={field.onChange}
                  onQueryChange={setLocationQuery}
                  results={locationResults.map((l) => ({
                    id: l.id,
                    label: l.name,
                  }))}
                  loading={locationLoading}
                  searchError={locationError}
                  error={errors.location_id?.message}
                />
              )}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* TIPOS */}
            <Controller
              name="typology_ids"
              control={control}
              rules={{ required: 'Selecciona al menos una tipología.' }}
              render={({ field }) => (
                <AsyncCheckSearchSelect
                  label="Tipologías"
                  placeholder="Buscar tipo..."
                  selectedIds={field.value ?? []} // 👈 CLAVE
                  onChange={field.onChange}
                  onQueryChange={setTypologyQuery}
                  results={typologyResults.map((t) => ({
                    id: t.id,
                    label: t.name,
                  }))}
                  loading={typologyLoading} // ✅
                  searchError={typologyError} // ✅
                  error={errors.typology_ids?.message}
                />
              )}
            />

            {/* TAMAÑOS */}
            <Controller
  name="document_sizes"
  control={control}
  rules={{ required: 'Selecciona al menos un tamaño.' }}
  render={({ field }) => (
    <StaticCheckSearchSelect
      label="Tamaños del documento"
      options={DOCUMENT_SIZES}
      selectedIds={field.value ? field.value.split(',') : []}
      onChange={(ids) => field.onChange(ids.join(','))}
      error={errors.document_sizes?.message}
    />
  )}
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
<div className="rounded-3xl border border-blue-200 bg-blue-50/40 p-4 space-y-4">
  <h3 className="text-center text-sm font-semibold text-blue-700 uppercase tracking-wide">
    Referencia anterior
  </h3>

  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
    <TextInput
      label="Fondo"
      value={prevFund}
      onChange={(e) => setPrevFund(e.target.value)}
      toUpper
      className="text-center font-semibold text-blue-700"
    />

    <TextInput
      label="Sección"
      value={prevSection}
      onChange={(e) => setPrevSection(e.target.value)}
      toUpper
      className="text-center font-semibold text-blue-700"
    />

    <TextInput
      label="Serie"
      value={prevSeries}
      onChange={(e) => setPrevSeries(e.target.value)}
      toUpper
      className="text-center font-semibold text-blue-700"
    />

    <TextInput
      label="No. Caja"
      value={prevBox}
      onChange={(e) => setPrevBox(e.target.value)}
      toUpper
      className="text-center font-semibold text-blue-700"
    />

    <TextInput
      label="No. Exp"
      value={prevExp}
      onChange={(e) => setPrevExp(e.target.value)}
      toUpper
      className="text-center font-semibold text-blue-700"
    />
  </div>

  <div className="rounded-xl border border-blue-300 bg-white py-2 text-center">
    <p className="text-[11px] text-gray-500">Código generado</p>
    <p className="text-sm font-bold text-red-600 tracking-wide">
      {previousReferenceCode || '—'}
    </p>
  </div>

  {errors.previous_reference_code && (
    <p className="text-center text-xs text-red-600">
      {errors.previous_reference_code.message}
    </p>
  )}
</div>
<Controller
  name="previous_reference_code"
  control={control}
  rules={{ required: 'Debes generar una referencia anterior.' }}
  render={({ field }) => (
   <input
  type="hidden"
  {...field}
  value={field.value ?? ''}
/>
  )}
/>


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
