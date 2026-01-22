import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Loader from '@ui/loader'

import { useRecordDiagnosis } from '../index/record-diagnosis-context'
import { useSearchDiagnosisCatalog } from '@/lib/api/hooks/record-diagnosis'
import { useGetRecordFileById } from '@/lib/api/hooks/record-files/use-get-record-file-by-id'
import { formatInputDate, invertDate } from '@/components/ui/functions'
import MainLayout from '@/components/layouts/mainLayout'
import { AsyncSearchSelect } from '../index/record-diagnosis-seach-select'
import { AsyncSearchSelect as AsyncSearchSelect2 } from '@/components/modules/record-files/index/record-file-seach-select'
import TextArea from '@/components/forms/text-area'
import { useSearchDeteriorations } from '@hooks/record-files'
import { useRecordFiles } from '../../record-files/index/record-file-context'
import { useUpdateRecordFile } from '@hooks/record-files'

const CreateRecordDiagnosisView = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { handleCreate, loadingCreate } = useRecordDiagnosis()
  const { record_file_id } = useParams<{ record_file_id: string }>()
  const { handleUpdate } = useRecordFiles()
  const {
    updateRecordFile,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateRecordFile()

  const recordFileId = record_file_id ? Number(record_file_id) : null
  const [formError, setFormError] = useState<string | null>(null)

  const [query, setQuery] = useState<string>()
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [observations, setObservations] = useState('')

  const { results, loading, error } = useSearchDiagnosisCatalog(query, true)

  const { recordFile, loading: loadingFile } =
    useGetRecordFileById(recordFileId)
  const [deteriorationQuery, setDeteriorationQuery] = useState('')
  const [deteriorationId, setDeteriorationId] = useState<number | null>(
    recordFile?.deterioration_status_id ?? null,
  )

  /* ---------------------------------------------
     Reset cuando cambia el expediente
  --------------------------------------------- */
  useEffect(() => {
    setSelectedIds([])
    setObservations('')
    setQuery(undefined)
  }, [record_file_id])

  useEffect(() => {
    if (recordFile?.deterioration_status_id) {
      setDeteriorationId(recordFile.deterioration_status_id)
    }
  }, [recordFile])
  const {
    results: deteriorationResults,
    loading: deteriorationLoading,
    error: deteriorationError,
  } = useSearchDeteriorations(deteriorationQuery, true)

  /* ---------------------------------------------
     Agrupar por concepto
  --------------------------------------------- */
  const grouped = useMemo(() => {
    const map: Record<string, typeof results> = {}
    results.forEach((item) => {
      if (!map[item.concept]) map[item.concept] = []
      map[item.concept].push(item)
    })
    return map
  }, [results])

  /* ---------------------------------------------
     Toggle
  --------------------------------------------- */
  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  /* ---------------------------------------------
     Submit
  --------------------------------------------- */
  const onSubmit = async () => {
    if (!recordFileId) return

    if (!selectedIds.length) {
      setFormError('Selecciona al menos un diagnóstico.')
      return
    }

    setFormError(null)

    try {
      await handleCreate({
        record_file_id: recordFileId,
        diagnosis_catalog_ids: selectedIds,
        observations: observations || undefined,
      })

      if (
        deteriorationId &&
        deteriorationId !== recordFile?.deterioration_status_id
      ) {
        await updateRecordFile(recordFileId, {
          deterioration_status_id: deteriorationId,
        })
      }

      navigate(basePath)
    } catch (err) {
      setFormError('Ocurrió un error al guardar la revisión.')
    }
  }

  const isSaving = loadingCreate || loadingUpdate

  /* ---------------------------------------------
     Cancelar → regresar a lista
  --------------------------------------------- */
  const basePath =
    location.pathname.split('/record_diagnosis')[0] + '/record_diagnosis'

  return (
    <div className="flex flex-col flex-1 h-full gap-4 px-2 md:px-4 w-full  ">
      {/* HEADER */}
      <div className="text-center flex flex-col gap-2">
        <h2 className="text-xl md:text-2xl font-bold text-blue-600">
          Crear revisión
        </h2>
        <p className="text-sm">
          Selecciona los diagnósticos aplicables al expediente
        </p>
      </div>
      {/* INFO EXPEDIENTE */}
      {loadingFile ? (
        <div className="flex flex-col items-center gap-2 text-base">
          <Loader size={25} />
          <span>Cargando expediente…</span>
        </div>
      ) : recordFile ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-center text-center p-3 rounded-xl border bg-blue-600 text-sm">
          <div>
            <p className="text-white font-semibold">Referencia</p>
            <p className=" text-dark-gray">
              {recordFile.reference_code ?? '—'}
            </p>
          </div>

          <div>
            <p className="text-white font-semibold">Estado</p>
            <p className="font-semibold text-dark-gray">
              {recordFile.deterioration_status?.name ?? '—'}
            </p>
          </div>

          <div>
            <p className="text-white font-semibold">Actualizado</p>
            <p className="font-semibold text-dark-gray">
              {formatInputDate(recordFile.updated_at)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-sm text-red-500">
          No se pudo cargar el expediente.
        </div>
      )}

      {/* BUSCADOR + LISTADO */}
      <div className="border rounded-xl p-3 space-y-3">
        <AsyncSearchSelect
          placeholder="Buscar diagnóstico…"
          value={null}
          results={[]} // NO usamos resultados aquí
          loading={loading}
          searchError={error}
          onChange={() => {}} // no-op
          onQueryChange={(text) => setQuery(text)}
        />

        {/* LISTADO */}
        <div className="max-h-72 overflow-y-auto  grid   grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4  scroll-t">
          {Object.entries(grouped).map(([concept, items]) => (
            <div
              key={concept}
              className="bg-dark-gray border border-dark-gray2 rounded-xl p-3"
            >
              <h4 className="font-bold text-blue-700 text-lg  text-center mb-1">
                {concept}
              </h4>

              <div className="space-y-1">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className="flex gap-2 text-sm cursor-pointer hover:bg-main-gray px-2 py-1 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggle(item.id)}
                    />
                    {item.detail}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {formError && (
        <div className="text-sm text-red-600 text-right">{formError}</div>
      )}
      <TextArea
        className="text-sm!"
        name="observations"
        label="Observaciones generales"
        placeholder="Agrega comentarios u observaciones adicionales"
        rows={3}
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
      />
      <div className="border rounded-xl p-3 space-y-2">
        <h4 className="font-semibold text-blue-600 text-sm">
          Estado de deterioro del expediente
        </h4>

        <AsyncSearchSelect2
          key={recordFile?.deterioration_status_id} // 👈 CLAVE
          placeholder="Buscar estado de deterioro…"
          value={deteriorationId}
          initialLabel={recordFile?.deterioration_status?.name}
          onChange={(id) => setDeteriorationId(id)}
          onQueryChange={setDeteriorationQuery}
          results={deteriorationResults.map((d) => ({
            id: d.id,
            label: d.name,
          }))}
          loading={deteriorationLoading}
          searchError={deteriorationError}
        />
      </div>

      {/* ACTIONS */}
      {isSaving ? (
        <Loader size={20} />
      ) : (
        <div className="flex justify-end gap-4">
          <button onClick={() => navigate(basePath)} className="cancel">
            <span>Cancelar</span>
          </button>

          <button onClick={onSubmit} disabled={isSaving} className="create">
            <span>Guardar revisión</span>
          </button>
        </div>
      )}
      {isSaving && (
        <div
          className="
    fixed inset-0 z-50
    bg-black/40
    flex flex-col items-center justify-center
    cursor-wait
  "
        >
          <Loader size={40} />
          <span className="mt-4 text-white text-lg font-semibold">
            Guardando revisión…
          </span>
        </div>
      )}
    </div>
  )
}

export default CreateRecordDiagnosisView
