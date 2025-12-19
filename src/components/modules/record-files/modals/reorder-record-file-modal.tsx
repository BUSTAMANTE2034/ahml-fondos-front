import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useRecordFiles } from '../index/record-file-context'
import { useState, useMemo } from 'react'

import {
  useSearchFunds,
  useSearchSections,
  useSearchSeries,
} from '@hooks/record-files'

import { AsyncSearchSelect } from '../index/record-file-seach-select'

const ReorderRecordFilesModal = () => {
  const {
    isReorderOpen,
    closeReorder,
    handleReorderAll,
    handleReorderWithFilters,
    loadingReorder,
  } = useRecordFiles()

  // =================================================
  // QUERIES (IGUAL QUE CREATE)
  // =================================================
  const [fundQuery, setFundQuery] = useState<string | undefined>(undefined)
  const [sectionQuery, setSectionQuery] = useState<string | undefined>(
    undefined
  )
  const [seriesQuery, setSeriesQuery] = useState<string | undefined>(undefined)

  // =================================================
  // IDS SELECCIONADOS
  // =================================================
  const [fundId, setFundId] = useState<number | null>(null)
  const [sectionId, setSectionId] = useState<number | null>(null)
  const [seriesId, setSeriesId] = useState<number | null>(null)
  const [boxNumber, setBoxNumber] = useState<string>('')

  // =================================================
  // LABELS SELECCIONADOS (PARA FILTRO GENERADO)
  // =================================================
  const [fundLabel, setFundLabel] = useState('')
  const [sectionLabel, setSectionLabel] = useState('')
  const [seriesLabel, setSeriesLabel] = useState('')

  // =================================================
  // HOOKS SEARCH
  // =================================================
  const { results: fundResults, loading: fundLoading } = useSearchFunds(
    fundQuery,
    true
  )

  const { results: sectionResults, loading: sectionLoading } =
    useSearchSections(sectionQuery, true)

  const { results: seriesResults, loading: seriesLoading } = useSearchSeries(
    seriesQuery,
    true
  )

  // =================================================
  // VALIDACIONES
  // =================================================
  const hasAnyFilter = useMemo(() => {
    return (
      fundId !== null ||
      sectionId !== null ||
      seriesId !== null ||
      boxNumber.trim() !== ''
    )
  }, [fundId, sectionId, seriesId, boxNumber])

  const generatedFilter = useMemo(() => {
    const parts = [
      fundLabel,
      sectionLabel,
      seriesLabel,
      boxNumber ? `C.${boxNumber}` : '',
    ]
    return parts.filter(Boolean).join('-')
  }, [fundLabel, sectionLabel, seriesLabel, boxNumber])

  if (!isReorderOpen) return null

  // =================================================
  // HANDLERS
  // =================================================
  const handleFiltered = async () => {
    await handleReorderWithFilters({
      fund_id: fundId ? String(fundId) : undefined,
      section_id: sectionId ? String(sectionId) : undefined,
      series_id: seriesId ?? undefined,
      box_number: boxNumber ? Number(boxNumber) : undefined,
    })
    closeReorder()
  }

  const handleAll = async () => {
    await handleReorderAll()
    closeReorder()
  }

  const clearAllFilters = () => {
    setFundId(null)
    setSectionId(null)
    setSeriesId(null)
    setBoxNumber('')

    setFundLabel('')
    setSectionLabel('')
    setSeriesLabel('')

    setFundQuery(undefined)
    setSectionQuery(undefined)
    setSeriesQuery(undefined)
  }

  // =================================================
  // UI
  // =================================================
  return (
    <Modal
      visible
      onClose={closeReorder}
      showCloseButton
      closeBackdrop={false}
      big={true}
    >
      <div className="flex flex-col gap-6 px-4 md:px-6 pb-6">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Reordenar expedientes
          </h2>
          <p className="text-sm text-dark2-gray mt-1">
            Selecciona filtros o reordena los números de expediente todo el sistema.
          </p>
        </div>

        {/* FILTROS */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-600">
            Filtros (opcional)
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {/* FONDO */}
            <AsyncSearchSelect
              label="Fondo"
              placeholder="Buscar fondo…"
              value={fundId}
              onChange={(id) => {
                setFundId(id)
                const f = fundResults.find((x) => x.id === id)
                setFundLabel(f ? `${f.acronym}` : '')
              }}
              onQueryChange={setFundQuery}
              results={fundResults.map((f) => ({
                id: f.id,
                label: `${f.acronym} — ${f.name} (${f.start_date} → ${f.end_date})`,
              }))}
              loading={fundLoading}
            />

            {/* SECCIÓN */}
            <AsyncSearchSelect
              label="Sección"
              placeholder="Buscar sección…"
              value={sectionId}
              onChange={(id) => {
                setSectionId(id)
                const s = sectionResults.find((x) => x.id === id)
                setSectionLabel(s ? `${s.acronym}` : '')
              }}
              onQueryChange={setSectionQuery}
              results={sectionResults.map((s) => ({
                id: s.id,
                label: `${s.acronym} — ${s.name} (${s.start_date} → ${s.end_date})`,
              }))}
              loading={sectionLoading}
            />

            {/* SERIE */}
            <AsyncSearchSelect
              label="Serie"
              placeholder="Buscar serie…"
              value={seriesId}
              onChange={(id) => {
                setSeriesId(id)
                const s = seriesResults.find((x) => x.id === id)
                setSeriesLabel(s ? `${s.acronym}` : '')
              }}
              onQueryChange={setSeriesQuery}
              results={seriesResults.map((s) => ({
                id: s.id,
                label: `${s.acronym} — ${s.name} (${s.start_date} → ${s.end_date})`,
              }))}
              loading={seriesLoading}
            />

            {/* CAJA */}
            <Input label="No. Caja" value={boxNumber} setter={setBoxNumber} />
          </div>

          <p className="text-xs text-dark2-gray">
            • Si defines filtros, se deshabilita <b>Reordenar todo</b>.<br />•
            Si no defines filtros, se deshabilita <b>Reordenar con filtros</b>.
          </p>
        </section>

        {/* =============================== */}
        {/*     FILTRO GENERADO             */}
        {/* =============================== */}
        <div className="border border-dark-gray2 rounded-3xl  mt-2 space-y-2 bg-main-gray text-center relative">
          <h3 className="text-lg font-semibold text-blue-600">
            Filtro generado
          </h3>

          {/* BOTÓN LIMPIAR */}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="
        absolute
        top-3
        right-3
        text-gray-400
        hover:text-red
        text-sm
        cursor-pointer
        close
      "
              aria-label="Limpiar filtros"
              title="Limpiar filtros"
            >
              ✕
            </button>
          )}

                    <p className="font-bold text-red text-base">
              {generatedFilter || '—'}
            </p>
        

          <p className="text-xs text-dark2-gray">
            Este filtro define exactamente qué expedientes serán reordenados.
          </p>
        </div>

        {/* BOTONES */}
        {loadingReorder ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-blue-600 font-medium">
              Reordenando expedientes…
            </span>
            <Loader size={25} />
          </div>
        ) : (
          <div className="flex justify-end gap-4 pt-3">
            <button className="cancel" onClick={closeReorder}>
              <span>Cancelar</span>
            </button>

            <button
              className={`
                          ${!hasAnyFilter ? 'hidden' : ''} create w-45! `}
              disabled={!hasAnyFilter}
              onClick={handleFiltered}
            >
              <span>Reordenar con filtros</span>
            </button>

            <button
              className={`${hasAnyFilter ? 'hidden' : ''} create w-40! `}
              disabled={hasAnyFilter}
              onClick={handleAll}
            >
              <span>Reordenar todo</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default ReorderRecordFilesModal

// --------------------------------------------------
// INPUT SIMPLE
// --------------------------------------------------
const Input = ({ label, value, setter, type = 'text' }: any) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-bold">{label}</label>

    <div className="relative w-full">
      <input
        value={value}
        onChange={(e) => setter(e.target.value.toLocaleUpperCase())}
        type={type}
        className="
          border-b border-dark-gray2
          text-sm w-full
          pr-6
          focus:outline-none
          focus:border-blue-600
          transition-colors duration-150
        "
      />

      {value && (
        <button
          type="button"
          onClick={() => setter('')}
          className="
            absolute
            right-0
            top-1/2
            -translate-y-1/2
            text-gray-400
            hover:text-red
            text-sm
            cursor-pointer
          "
          aria-label="Limpiar"
        >
          ✕
        </button>
      )}
    </div>
  </div>
)
