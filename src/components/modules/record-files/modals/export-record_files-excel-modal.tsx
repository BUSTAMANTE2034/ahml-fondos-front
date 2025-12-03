import Modal from '@ui/modal'
import Loader from '@ui/loader'
import { useRecordFiles } from '../index/record-file-context'
import { useExportRecordFilesExcel } from '@/lib/api/hooks/record-files/use-get-excel'
import { useState } from 'react'
import SingleDatePicker from '@/components/ui/dataPiker'

import {
  useSearchFunds,
  useSearchSections,
  useSearchSeries,
  useSearchLocations,
  useSearchDeteriorations,
  useSearchTypologies,
} from '@hooks/record-files'

import { AsyncSearchSelect } from '../index/record-file-seach-select'
import { AsyncCheckSearchSelect } from '../index/record-file-seach-check'

import {
  ArrowUpAZ,
  ArrowDownAZ,
  CalendarDays,
  Clock4,
  ShieldAlert,
  Hash,
  FileText,
} from 'lucide-react'

// ---------------------------------------------------------
// ORDER TYPES
// ---------------------------------------------------------
type OrderField =
  | 'created_at'
  | 'updated_at'
  | 'file_date'
  | 'deterioration_status_updated_at'
  | 'box_number'
  | 'file_number'

type OrderDir = 'asc' | 'desc'

type OrderByParam = `${OrderField}_${OrderDir}`

const ORDER_FIELDS: { value: OrderField; label: string; icon: any }[] = [
  { value: 'updated_at', label: 'Última actualización', icon: Clock4 },
  { value: 'created_at', label: 'Fecha de creación', icon: CalendarDays },
  { value: 'file_date', label: 'Fecha documental', icon: CalendarDays },
  {
    value: 'deterioration_status_updated_at',
    label: 'Último deterioro',
    icon: ShieldAlert,
  },
  { value: 'box_number', label: 'Número de caja', icon: Hash },
  { value: 'file_number', label: 'Número de expediente', icon: FileText },
]

// ---------------------------------------------------------
// COMPONENTE
// ---------------------------------------------------------
const ExportRecordFilesExcelModal = () => {
  const {
    isExportExcelOpen,
    closeExportExcel,

    query,
    reference_code,
    previous_reference_code,
    file_number,
    box_number,
    fund_name,
    section_name,
    series_name,
    location_name,
    deterioration_name,
    typology_name,
    sensitive,
    availability_status,
    file_date_after,
    file_date_before,
    order_by,
  } = useRecordFiles()

  const { exportExcel, loading, error } = useExportRecordFilesExcel()

  // ---------------------------------------------------------
  // STATES
  // ---------------------------------------------------------

  const [perPage, setPerPage] = useState('50')

  const [fQuery, setFQuery] = useState(query)
  const [fReferenceCode, setFReferenceCode] = useState(reference_code)
  const [fPrevReferenceCode, setFPrevReferenceCode] = useState(
    previous_reference_code
  )
  const [fFileNumber, setFFileNumber] = useState(file_number)
  const [fBoxNumber, setFBoxNumber] = useState(box_number)

  // FONDO
  const [fFundId, setFFundId] = useState<number | null>(null)
  const [fFundName, setFFundName] = useState<string>('')
  const [fFundQuery, setFFundQuery] = useState<string>('')

  // SECCIÓN
  const [fSectionId, setFSectionId] = useState<number | null>(null)
  const [fSectionName, setFSectionName] = useState<string>('')
  const [fSectionQuery, setFSectionQuery] = useState<string>('')

  // SERIE
  const [fSeriesId, setFSeriesId] = useState<number | null>(null)
  const [fSeriesName, setFSeriesName] = useState<string>('')
  const [fSeriesQuery, setFSeriesQuery] = useState<string>('')

  // UBICACIÓN
  const [fLocationId, setFLocationId] = useState<number | null>(null)
  const [fLocationName, setFLocationName] = useState<string>('')
  const [fLocationQuery, setFLocationQuery] = useState<string>('')

  // DETERIORO
  const [fDeteriorationId, setFDeteriorationId] = useState<number | null>(null)
  const [fDeteriorationName, setFDeteriorationName] = useState<string>('')
  const [fDeteriorationQuery, setFDeteriorationQuery] = useState<string>('')

  // TIPOLOGÍA
  const [fTypologyId, setFTypologyId] = useState<number | null>(null)
  const [fTypologyName, setFTypologyName] = useState<string>('')
  const [fTypologyQuery, setFTypologyQuery] = useState<string>('')

  const [fSensitive, setFSensitive] = useState(sensitive)
  const [fAvail, setFAvail] = useState(availability_status)

  const [fFileAfter, setFFileAfter] = useState(file_date_after)
  const [fFileBefore, setFFileBefore] = useState(file_date_before)

  const [fOrderBy, setFOrderBy] = useState<OrderByParam | null>(order_by)

  const applyOrder = (field: OrderField, dir: OrderDir) => {
    setFOrderBy(`${field}_${dir}`)
  }
 const clearFilters = () => {
  setPerPage('50')

  // filtros directos
  setFQuery('')
  setFReferenceCode('')
  setFPrevReferenceCode('')
  setFFileNumber('')
  setFBoxNumber('')

  // relaciones: NOMBRES
  setFFundName('')
  setFSectionName('')
  setFSeriesName('')
  setFLocationName('')
  setFDeteriorationName('')
  setFTypologyName('')

  // relaciones: IDs
  setFFundId(null)
  setFSectionId(null)
  setFSeriesId(null)
  setFLocationId(null)
  setFDeteriorationId(null)
  setFTypologyId(null)

  // relaciones: QUERIES
  setFFundQuery('')
  setFSectionQuery('')
  setFSeriesQuery('')
  setFLocationQuery('')
  setFDeteriorationQuery('')
  setFTypologyQuery('')

  // otros filtros
  setFSensitive('all')
  setFAvail('all')
  setFFileAfter(null)
  setFFileBefore(null)

  setFOrderBy(null)
}


  // ---------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------
  const { results: fundResults, loading: fundLoading } =
    useSearchFunds(fFundName)
  const { results: sectionResults, loading: sectionLoading } =
    useSearchSections(fSectionName)
  const { results: seriesResults, loading: seriesLoading } =
    useSearchSeries(fSeriesName)
  const { results: locationResults, loading: locationLoading } =
    useSearchLocations(fLocationName)
  const { results: deteriorationResults, loading: deteriorationLoading } =
    useSearchDeteriorations(fDeteriorationName)
  const { results: typologyResults, loading: typologyLoading } =
    useSearchTypologies(fTypologyName)

  if (!isExportExcelOpen) return null

  // ---------------------------------------------------------
  // EXPORT
  // ---------------------------------------------------------
  const handleExport = async () => {
    await exportExcel({
      perPage: Number(perPage),

      query: fQuery,
      reference_code: fReferenceCode,
      previous_reference_code: fPrevReferenceCode,
      file_number: fFileNumber,
      box_number: fBoxNumber,

      fund_name: fFundName,
      section_name: fSectionName,
      series_name: fSeriesName,
      location_name: fLocationName,
      deterioration_name: fDeteriorationName,
      typology_name: fTypologyName,

      sensitive: fSensitive,
      availability_status: fAvail,

      file_date_after: fFileAfter,
      file_date_before: fFileBefore,

      order_by: fOrderBy ?? undefined,
    })
  }

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <Modal visible onClose={closeExportExcel} showCloseButton>
      <div className="flex flex-col gap-6 px-4 md:px-6 pb-6">
        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-blue-600">
            Exportar Excel
          </h2>
          <p className="text-sm text-dark2-gray mt-1">
            Configura los filtros del reporte antes de exportar.
          </p>
        </div>

        {error && <p className="text-red-600 text-sm text-center">⚠ {error}</p>}

        {/* =============================== */}
        {/*         CANTIDAD                */}
        {/* =============================== */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-blue-600">
            Cantidad a exportar
          </h3>
          <input
            type="number"
            min={1}
            max={50000}
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
            className="border  border-dark-gray2 rounded-3xl p-2 text-sm w-full"
          />
        </section>

        {/* =============================== */}
        {/*      BÚSQUEDA GLOBAL            */}
        {/* =============================== */}
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-blue-600">
            Búsqueda global
          </h3>
          <input
            value={fQuery}
            onChange={(e) => setFQuery(e.target.value)}
            className="border  border-dark-gray2 rounded-3xl p-2 text-sm w-full"
            placeholder="Buscar por código, número, caja..."
          />
        </section>

        {/* =============================== */}
        {/*     FILTROS DIRECTOS            */}
        {/* =============================== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-600">
            Filtros directos
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Código"
              value={fReferenceCode}
              setter={setFReferenceCode}
            />
            <Input
              label="Código anterior"
              value={fPrevReferenceCode}
              setter={setFPrevReferenceCode}
            />
            <Input
              label="No. expediente"
              value={fFileNumber}
              setter={setFFileNumber}
              type="number"
            />
            <Input
              label="No. caja"
              value={fBoxNumber}
              setter={setFBoxNumber}
              type="number"
            />
          </div>
        </section>

        {/* =============================== */}
        {/*  FILTROS RELACIONADOS (ASYNC)   */}
        {/* =============================== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-600">Relaciones</h3>
          <div className="grid grid-cols-2 gap-1 w-full ">
            <AsyncSearchSelect
              label="Fondo"
              placeholder="Buscar fondo..."
              value={fFundId}
              onChange={(id) => {
                setFFundId(id)
                const selected = fundResults.find((f) => f.id === id)
                setFFundName(selected?.name ?? '')
              }}
              onQueryChange={(q) => {
                setFFundQuery(q)
                setFFundName(q) // mantiene coherencia al escribir
              }}
              results={fundResults.map((f) => ({ id: f.id, label: f.name }))}
              loading={fundLoading}
            />

            <AsyncSearchSelect
              label="Sección"
              placeholder="Buscar sección..."
              value={fSectionId}
              onChange={(id) => {
                setFSectionId(id)
                const selected = sectionResults.find((s) => s.id === id)
                setFSectionName(selected?.name ?? '')
              }}
              onQueryChange={(q) => {
                setFSectionQuery(q)
                setFSectionName(q)
              }}
              results={sectionResults.map((s) => ({ id: s.id, label: s.name }))}
              loading={sectionLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-1 w-full ">
            <AsyncSearchSelect
              label="Serie"
              placeholder="Buscar serie..."
              value={fSeriesId}
              onChange={(id) => {
                setFSeriesId(id)
                const selected = seriesResults.find((s) => s.id === id)
                setFSeriesName(selected?.name ?? '')
              }}
              onQueryChange={(q) => {
                setFSeriesQuery(q)
                setFSeriesName(q)
              }}
              results={seriesResults.map((s) => ({ id: s.id, label: s.name }))}
              loading={seriesLoading}
            />

            <AsyncSearchSelect
              label="Ubicación"
              placeholder="Buscar ubicación..."
              value={fLocationId}
              onChange={(id) => {
                setFLocationId(id)
                const selected = locationResults.find((l) => l.id === id)
                setFLocationName(selected?.name ?? '')
              }}
              onQueryChange={(q) => {
                setFLocationQuery(q)
                setFLocationName(q)
              }}
              results={locationResults.map((l) => ({
                id: l.id,
                label: l.name,
              }))}
              loading={locationLoading}
            />
          </div>
          <div className="grid grid-cols-2 gap-1 w-full">
            <AsyncSearchSelect
              label="Deterioro"
              placeholder="Buscar deterioro..."
              value={fDeteriorationId}
              onChange={(id) => {
                setFDeteriorationId(id)
                const selected = deteriorationResults.find((d) => d.id === id)
                setFDeteriorationName(selected?.name ?? '')
              }}
              onQueryChange={(q) => {
                setFDeteriorationQuery(q)
                setFDeteriorationName(q)
              }}
              results={deteriorationResults.map((d) => ({
                id: d.id,
                label: d.name,
              }))}
              loading={deteriorationLoading}
            />

            <AsyncSearchSelect
              label="Tipología"
              placeholder="Buscar tipología..."
              value={fTypologyId}
              onChange={(id) => {
                setFTypologyId(id)
                const selected = typologyResults.find((t) => t.id === id)
                setFTypologyName(selected?.name ?? '')
              }}
              onQueryChange={(q) => {
                setFTypologyQuery(q)
                setFTypologyName(q)
              }}
              results={typologyResults.map((t) => ({
                id: t.id,
                label: t.name,
              }))}
              loading={typologyLoading}
            />
          </div>
        </section>

        {/* =============================== */}
        {/*      FECHAS DOCUMENTALES         */}
        {/* =============================== */}
        <section className="">
          <h3 className="text-sm font-semibold text-blue-600">
            Fecha documental
          </h3>
          <div className="grid grid-cols-2 gap-1 w-full">
            <SingleDatePicker
              label="Desde"
              value={fFileAfter}
              onChange={setFFileAfter}
            />
            <SingleDatePicker
              label="Hasta"
              value={fFileBefore}
              onChange={setFFileBefore}
            />
          </div>
        </section>

        {/* =============================== */}
        {/* CONFIDENCIALIDAD / DISPONIBILIDAD */}
        {/* =============================== */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-blue-600">
            Estado del expediente
          </h3>
          <div className="grid grid-cols-2 gap-1 w-full">
            <Select
              label="Confidencialidad"
              value={fSensitive}
              setter={setFSensitive}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'delicate', label: 'Dato sensible' },
                { value: 'not_delicate', label: 'Normal' },
              ]}
            />

            <Select
              label="Disponibilidad"
              value={fAvail}
              setter={setFAvail}
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'available', label: 'Disponible' },
                { value: 'on_loan', label: 'Prestado' },
                { value: 'under_review', label: 'En revisión' },
                { value: 'unavailable', label: 'No disponible' },
              ]}
            />
          </div>
        </section>

        {/* =============================== */}
        {/*        ORDENAMIENTO             */}
        {/* =============================== */}
        <section className="border  border-dark-gray2 rounded-xl p-4 bg-main-gray space-y-3">
          <h3 className="text-sm font-semibold text-blue-600">Ordenar por</h3>

          {ORDER_FIELDS.map((f) => {
            const isAsc = fOrderBy === `${f.value}_asc`
            const isDesc = fOrderBy === `${f.value}_desc`
            const Icon = f.icon

            return (
              <div key={f.value} className="flex items-center gap-2">
                <Icon size={16} />
                <span className="flex-1 text-xs">{f.label}</span>

                <OrderBtn
                  active={isAsc}
                  onClick={() => applyOrder(f.value, 'asc')}
                >
                  <ArrowUpAZ size={16} />
                </OrderBtn>

                <OrderBtn
                  active={isDesc}
                  onClick={() => applyOrder(f.value, 'desc')}
                >
                  <ArrowDownAZ size={16} />
                </OrderBtn>
              </div>
            )
          })}
        </section>

        {/* =============================== */}
        {/* BOTONES                         */}
        {/* =============================== */}
        {loading ? (
          <div className="flex flex-col justify-center items-center w-full gap-2">
            <span className="text-blue-600 font-medium">
              Generando archivo…
            </span>
            <Loader size={25} />
          </div>
        ) : (
          <div className="flex justify-between items-center pt-3">
            <button
              className="text-xs font-medium border border-dark2-gray rounded-3xl px-3 py-1 bg-gray-1 hover:text-blue-800 cursor-pointer"
              onClick={clearFilters}
            >
              Limpiar filtros
            </button>

            <div className="flex gap-4">
              <button className="cancel" onClick={closeExportExcel}>
                <span>Cancelar</span>
              </button>
              <button className="create" onClick={handleExport}>
                <span>Exportar</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

// -----------------------------------------------------------------------------
// MINI COMPONENTES REUTILIZABLES
// -----------------------------------------------------------------------------

const Input = ({ label, value, setter, type = 'text' }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium">{label}</label>
    <input
      value={value}
      onChange={(e) => setter(e.target.value)}
      type={type}
      className="border  border-dark-gray2 rounded-3xl p-2 text-sm w-full"
    />
  </div>
)

const Select = ({ label, value, setter, options }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium">{label}</label>
    <select
      value={value}
      onChange={(e) => setter(e.target.value)}
      className="border border-dark-gray2 rounded-3xl px-2 py-1 text-sm w-full "
    >
      {options.map((o: any) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
)

const OrderBtn = ({ active, onClick, children }: any) => (
  <button
    onClick={onClick}
    className={`p-1 rounded-2xl transition ${
      active ? 'bg-blue-600 text-white' : 'hover:bg-white active:bg-main-gray'
    }`}
  >
    {children}
  </button>
)

export default ExportRecordFilesExcelModal
