// --------------------------------------------------------------
//  UpdateRecordFileModal — versión corregida y alineada con Create
// --------------------------------------------------------------

import Modal from '@ui/modal'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

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
  useSearchBoxes,
} from '@hooks/record-files'

import TextInput from '@/components/forms/text'
import {
  DOCUMENT_SIZES,
  isDateBeforeOrToday,
  parseDocumentSizesToList,
} from '@/components/ui/functions'

import { StaticCheckSearchSelect } from '../index/static-check-select'

const UpdateRecordFileModal = () => {
  const { isEditOpen, closeEdit, selected, handleUpdate, loadingUpdate } =
    useRecordFiles()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateRecordFile>()

  // -----------------------------------------
  // QUERIES PARA SELECTS
  // -----------------------------------------
  const [boxQuery, setBoxQuery] = useState('')
  const [fundQuery, setFundQuery] = useState('')
  const [sectionQuery, setSectionQuery] = useState('')
  const [seriesQuery, setSeriesQuery] = useState('')
  const [locationQuery, setLocationQuery] = useState('')
  const [deteriorationQuery, setDeteriorationQuery] = useState('')
  const [typologyQuery, setTypologyQuery] = useState('')

  const { results: boxResults, loading: boxLoading, error: boxError } =
    useSearchBoxes(boxQuery, true)
  const { results: fundResults } = useSearchFunds(fundQuery, true)
  const { results: sectionResults } = useSearchSections(sectionQuery, true)
  const { results: seriesResults } = useSearchSeries(seriesQuery, true)
  const { results: locationResults } = useSearchLocations(locationQuery, true)
  const { results: deteriorationResults } = useSearchDeteriorations(
    deteriorationQuery,
    true
  )
  const { results: typologyResults } = useSearchTypologies(typologyQuery, true)

  // -----------------------------------------
  // REFERENCIA ANTERIOR
  // -----------------------------------------
  const [prevFund, setPrevFund] = useState('')
  const [prevSection, setPrevSection] = useState('')
  const [prevSeries, setPrevSeries] = useState('')
  const [prevBox, setPrevBox] = useState('')
  const [prevExp, setPrevExp] = useState('')

  const previousReferenceCode = [
    prevFund,
    prevSection,
    prevSeries,
    prevBox ? `C.${prevBox}` : '',
    prevExp ? `Exp.${prevExp}` : '',
  ]
    .filter(Boolean)
    .join('-')

  useEffect(() => {
    setValue('previous_reference_code', previousReferenceCode)
  }, [previousReferenceCode, setValue])

  // -----------------------------------------
  // REGISTROS OBLIGATORIOS (igual que en Create)
  // -----------------------------------------
  useEffect(() => {
    register('box_id', { required: 'Selecciona una caja.' })
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
  // PRECARGA DE DATOS
  // -----------------------------------------
  useEffect(() => {
    if (!selected) return

    reset({
      subject: selected.subject,
      file_number: selected.file_number,
      box_id: selected.box_id,
      page_count: selected.page_count,
      file_date: selected.file_date,

      sensitive_data: selected.sensitive_data,
      comments: selected.comments,

      fund_id: selected.fund_id,
      section_id: selected.section_id,
      series_id: selected.series_id,
      location_id: selected.location_id,

      deterioration_status_id: selected.deterioration_status_id,
      typology_ids: selected.typologies?.map((t) => t.id) || [],

      previous_reference_code: selected.previous_reference_code || '',
      document_sizes: selected.document_sizes ?? '',
    })

    // precargar referencia anterior
    if (selected.previous_reference_code) {
      const raw = selected.previous_reference_code.split('-')

      setPrevFund(raw[0] || '')
      setPrevSection(raw[1] || '')
      setPrevSeries(raw[2] || '')

      const box = raw.find((x) => x.startsWith('C.'))
      const exp = raw.find((x) => x.startsWith('Exp.'))

      setPrevBox(box ? box.replace('C.', '') : '')
      setPrevExp(exp ? exp.replace('Exp.', '') : '')
    }
  }, [selected, reset, setValue])

  // -----------------------------------------
  // SUBMIT
  // -----------------------------------------
  const onSubmit = async (data: UpdateRecordFile) => {
    await handleUpdate({
      ...data,
    })
  }

  if (!isEditOpen || !selected) return null

  return (
    <Modal
      visible
      onClose={closeEdit}
      showCloseButton
      closeBackdrop={false}
      big
    >
      <div className="flex flex-col gap-4 px-2 md:px-4">
        {/* HEADER */}
        <div className="text-center gap-2 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Editar Expediente
          </h2>
          <p className="text-sm">Modifica los datos del expediente.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          {/* ================= PRIMERA FILA ================= */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* <FormInput
              name="file_number"
              label="Número de expediente"
              register={register}
              errors={errors}
              rules={{ required: 'Campo obligatorio' }}
            /> */}

            <AsyncSearchSelect
  label="Caja"
  placeholder="Buscar caja…"
  value={watch('box_id') ?? null}
  onChange={(id) =>
    setValue('box_id', id, { shouldValidate: true })
  }
  onQueryChange={setBoxQuery}
  results={boxResults.map((b) => ({
    id: b.id,
    label: `${b.box_number} — ${b.physical_location?.code ?? 'Sin ubicación'}`,
  }))}
  loading={boxLoading}
  searchError={boxError}
  error={errors.box_id?.message}
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
              max={new Date().toISOString().split('T')[0]} // evita fechas futuras desde el input
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
            <AsyncSearchSelect
              label="Deterioro"
              placeholder="Buscar deterioro…"
              value={watch('deterioration_status_id') ?? null}
              initialLabel={selected.deterioration_status?.name}
              onChange={(id) =>
                setValue('deterioration_status_id', id, {
                  shouldValidate: true,
                })
              }
              onQueryChange={setDeteriorationQuery}
              results={deteriorationResults.map((d) => ({
                id: d.id,
                label: d.name,
              }))}
              loading={false}
              searchError={null}
              error={errors.deterioration_status_id?.message}
            />
          </div>

          {/* ================= FONDO / SECCIÓN ================= */}
          <div className="grid grid-cols-2 gap-4">
            <AsyncSearchSelect
              label="Fondo"
              placeholder="Buscar fondo…"
              value={watch('fund_id') ?? null}
              initialLabel={`${selected.fund?.acronym} - ${selected.fund?.name}`}
              onChange={(id) =>
                setValue('fund_id', id, { shouldValidate: true })
              }
              onQueryChange={setFundQuery}
              results={fundResults.map((f) => ({
                id: f.id,
                label: `${f.acronym} — ${f.name}  (${f.start_date} → ${f.end_date})`,
              }))}
              loading={false}
              searchError={null}
              error={errors.fund_id?.message}
            />

            <AsyncSearchSelect
              label="Sección"
              placeholder="Buscar sección…"
              value={watch('section_id') ?? null}
              initialLabel={`${selected.section?.acronym} - ${selected.section?.name}`}
              onChange={(id) =>
                setValue('section_id', id, { shouldValidate: true })
              }
              onQueryChange={setSectionQuery}
              results={sectionResults.map((s) => ({
                id: s.id,
                label: `${s.acronym} — ${s.name}  (${s.start_date} → ${s.end_date})`,
              }))}
              loading={false}
              searchError={null}
              error={errors.section_id?.message}
            />
          </div>

          {/* ================= SERIE / UBICACIÓN ================= */}
          <div className="grid grid-cols-2 gap-4">
            <AsyncSearchSelect
              label="Serie"
              placeholder="Buscar serie…"
              value={watch('series_id') ?? null}
              initialLabel={`${selected.series?.acronym} - ${selected.series?.name}`}
              onChange={(id) =>
                setValue('series_id', id, { shouldValidate: true })
              }
              onQueryChange={setSeriesQuery}
              results={seriesResults.map((s) => ({
                id: s.id,
               label: `${s.acronym} — ${s.name}  (${s.start_date} → ${s.end_date})`,
              }))}
              loading={false}
              searchError={null}
              error={errors.series_id?.message}
            />

            <AsyncSearchSelect
              label="Localidad"
              placeholder="Buscar ubicación…"
              value={watch('location_id') ?? null}
              initialLabel={selected.location?.name}
              onChange={(id) =>
                setValue('location_id', id, { shouldValidate: true })
              }
              onQueryChange={setLocationQuery}
              results={locationResults.map((l) => ({
                id: l.id,
                label: l.name,
              }))}
              loading={false}
              searchError={null}
              error={errors.location_id?.message}
            />
          </div>

          {/* ASUNTO */}
          <TextArea
            label="Asunto"
            placeholder="Escribe un asunto breve..."
            maxLength={1500}
            {...register('subject', { required: 'Campo obligatorio' })}
            error={errors.subject?.message}
          />

          {/* TIPOLOGÍAS Y TAMAÑOS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AsyncCheckSearchSelect
              label="Tipologías"
              placeholder="Buscar tipo..."
              selectedIds={watch('typology_ids') ?? []}
              onChange={(ids) =>
                setValue('typology_ids', ids, { shouldValidate: true })
              }
              onQueryChange={setTypologyQuery}
              results={typologyResults.map((t) => ({
                id: t.id,
                label: t.name,
              }))}
              loading={false}
              searchError={null}
              error={errors.typology_ids?.message}
              initialSelected={
    selected.typologies?.map((t) => ({
      id: t.id,
      label: t.name,
    })) || []
  }
            />

            <StaticCheckSearchSelect
              label="Tamaños del documento"
              options={DOCUMENT_SIZES}
              selectedIds={watch('document_sizes')?.split(',') || []}
              onChange={(ids) => {
                setValue('document_sizes', ids.join(','), {
                  shouldValidate: true,
                })
              }}
              error={errors.document_sizes?.message}
            />
          </div>

          {/* COMENTARIOS */}
          <FormInput
            name="comments"
            label="Comentarios"
            placeholder="Observaciones (opcional)"
            register={register}
            errors={errors}
          />

          {/* ================= REFERENCIA ANTERIOR ================= */}
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
                label="Caja"
                value={prevBox}
                onChange={(e) => setPrevBox(e.target.value)}
                toUpper
              />

              <TextInput
                className="text-center border-dark-gray2 border rounded-3xl bg-white font-medium text-blue-600"
                label="Exp."
                toUpper
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

          {errors.previous_reference_code && (
            <p className="text-red-600 text-xs">
              Debes generar una referencia anterior antes de guardar.
            </p>
          )}

          {/* BOTONES */}
          {loadingUpdate ? (
            <div className="flex justify-center items-center gap-4">
              <span className="text-blue-600 font-medium text-lg">
                Guardando cambios…
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

export default UpdateRecordFileModal
