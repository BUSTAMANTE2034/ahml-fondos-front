import Modal from "@ui/modal"
import Loader from "@ui/loader"
import { useRecordFiles } from "../index/record-file-context"
import { useExportRecordFilesExcel } from "@/lib/api/hooks/record-files/use-get-excel"
import { useState } from "react"
import SingleDatePicker from "@/components/ui/dataPiker"

import {
  useSearchFunds,
  useSearchSections,
  useSearchSeries,
  useSearchLocations,
  useSearchDeteriorations,
  useSearchTypologies,
} from "@hooks/record-files"

import { AsyncSearchSelect } from "../index/record-file-seach-select"
import { AsyncCheckSearchSelect } from "../index/record-file-seach-check"

import {
  ArrowUpAZ,
  ArrowDownAZ,
  CalendarDays,
  Clock4,
  ShieldAlert,
  Hash,
  FileText
} from "lucide-react"
type OrderField =
  | "created_at"
  | "updated_at"
  | "file_date"
  | "deterioration_status_updated_at"
  | "box_number"
  | "file_number";

type OrderDir = "asc" | "desc";

export type OrderByParam = `${OrderField}_${OrderDir}`;
// ================================================================
// ORDENAMIENTO — mismo que FilterOrder
// ================================================================
const ORDER_FIELDS = [
  { value: "updated_at", label: "Última actualización", icon: Clock4 },
  { value: "created_at", label: "Fecha de creación", icon: CalendarDays },
  { value: "file_date", label: "Fecha del documento", icon: CalendarDays },
  { value: "deterioration_status_updated_at", label: "Último deterioro", icon: ShieldAlert },
  { value: "box_number", label: "Número de caja", icon: Hash },
  { value: "file_number", label: "Número de expediente", icon: FileText },
] as const

const ExportRecordFilesExcelModal = () => {
  const {
    isExportExcelOpen,
    closeExportExcel,

    // valores actuales desde la tabla
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

  // ==============================================================
  // STATES LOCALES
  // ==============================================================
  const [perPage, setPerPage] = useState("200")

  const [fQuery, setFQuery] = useState(query)

  const [fReferenceCode, setFReferenceCode] = useState(reference_code)
  const [fPrevReferenceCode, setFPrevReferenceCode] = useState(previous_reference_code)
  const [fFileNumber, setFFileNumber] = useState(file_number)
  const [fBoxNumber, setFBoxNumber] = useState(box_number)

  const [fFundName, setFFundName] = useState(fund_name)
  const [fSectionName, setFSectionName] = useState(section_name)
  const [fSeriesName, setFSeriesName] = useState(series_name)
  const [fLocationName, setFLocationName] = useState(location_name)
  const [fDeteriorationName, setFDeteriorationName] = useState(deterioration_name)
  const [fTypologyName, setFTypologyName] = useState(typology_name)

  const [fSensitive, setFSensitive] = useState(sensitive)
  const [fAvail, setFAvail] = useState(availability_status)

  const [fFileAfter, setFFileAfter] = useState(file_date_after)
  const [fFileBefore, setFFileBefore] = useState(file_date_before)

  // ORDER BY
  const [fOrderBy, setFOrderBy] = useState<OrderByParam | null>(order_by)

 const applyOrder = (field: OrderField, dir: OrderDir) =>
  setFOrderBy(`${field}_${dir}`);


  // ==============================================================
  // HOOKS DE BÚSQUEDA (async)
  // ==============================================================
  const { results: fundResults, loading: fundLoading } = useSearchFunds(fFundName)
  const { results: sectionResults, loading: sectionLoading } = useSearchSections(fSectionName)
  const { results: seriesResults, loading: seriesLoading } = useSearchSeries(fSeriesName)
  const { results: locationResults, loading: locationLoading } = useSearchLocations(fLocationName)
  const { results: deteriorationResults, loading: deteriorationLoading } = useSearchDeteriorations(fDeteriorationName)
  const { results: typologyResults, loading: typologyLoading } = useSearchTypologies(fTypologyName)

  if (!isExportExcelOpen) return null

  // ==============================================================
  // EXPORTAR
  // ==============================================================
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

      order_by: fOrderBy,
    })
  }

  // ==============================================================
  // RENDER
  // ==============================================================
  return (
    <Modal visible onClose={closeExportExcel} showCloseButton big>
      <div className="flex flex-col gap-6 px-4 md:px-6">

        <h2 className="text-xl md:text-2xl font-bold text-blue-600 text-center">
          Exportar Excel
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center">⚠ {error}</p>
        )}

        {/* ---------------------------------------------------------
            CANTIDAD A EXPORTAR
        ---------------------------------------------------------- */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold">Cantidad a exportar</label>
          <input
            type="number"
            min={1}
            max={50000}
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
            className="border rounded-lg p-2 text-sm"
          />
        </div>

        {/* ---------------------------------------------------------
            BÚSQUEDA GLOBAL
        ---------------------------------------------------------- */}
        <div className="flex flex-col">
          <label className="text-xs font-semibold">Búsqueda global</label>
          <input
            value={fQuery}
            onChange={(e) => setFQuery(e.target.value)}
            className="border rounded-lg p-2 text-sm"
            placeholder="Buscar por código, número, caja..."
          />
        </div>

        {/* ---------------------------------------------------------
            FILTROS DIRECTOS
        ---------------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="text-xs font-semibold">Código</label>
            <input
              value={fReferenceCode}
              onChange={(e) => setFReferenceCode(e.target.value)}
              className="border rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">Código anterior</label>
            <input
              value={fPrevReferenceCode}
              onChange={(e) => setFPrevReferenceCode(e.target.value)}
              className="border rounded-lg p-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">No. expediente</label>
            <input
              value={fFileNumber}
              onChange={(e) => setFFileNumber(e.target.value)}
              className="border rounded-lg p-2 text-sm"
              type="number"
            />
          </div>

          <div>
            <label className="text-xs font-semibold">No. caja</label>
            <input
              value={fBoxNumber}
              onChange={(e) => setFBoxNumber(e.target.value)}
              className="border rounded-lg p-2 text-sm"
              type="number"
            />
          </div>
        </div>

        {/* ---------------------------------------------------------
            FILTROS POR RELACIONES (ASINCRÓNICOS)
        ---------------------------------------------------------- */}
        <AsyncSearchSelect
          label="Fondo"
          placeholder="Buscar fondo..."
          value={null}
          onChange={() => {}}
          onQueryChange={setFFundName}
          results={fundResults.map(f => ({ id: f.id, label: f.name }))}
          loading={fundLoading}
        />

        <AsyncSearchSelect
          label="Sección"
          placeholder="Buscar sección..."
          value={null}
          onChange={() => {}}
          onQueryChange={setFSectionName}
          results={sectionResults.map(s => ({ id: s.id, label: s.name }))}
          loading={sectionLoading}
        />

        <AsyncSearchSelect
          label="Serie"
          placeholder="Buscar serie..."
          value={null}
          onChange={() => {}}
          onQueryChange={setFSeriesName}
          results={seriesResults.map(s => ({ id: s.id, label: s.name }))}
          loading={seriesLoading}
        />

        <AsyncSearchSelect
          label="Ubicación"
          placeholder="Buscar ubicación..."
          value={null}
          onChange={() => {}}
          onQueryChange={setFLocationName}
          results={locationResults.map(l => ({ id: l.id, label: l.name }))}
          loading={locationLoading}
        />

        <AsyncSearchSelect
          label="Deterioro"
          placeholder="Buscar deterioro..."
          value={null}
          onChange={() => {}}
          onQueryChange={setFDeteriorationName}
          results={deteriorationResults.map(d => ({ id: d.id, label: d.name }))}
          loading={deteriorationLoading}
        />

        <AsyncSearchSelect
          label="Tipología"
          placeholder="Buscar tipología..."
          value={null}
          onChange={() => {}}
          onQueryChange={setFTypologyName}
          results={typologyResults.map(t => ({ id: t.id, label: t.name }))}
          loading={typologyLoading}
        />

        {/* ---------------------------------------------------------
            FECHAS DOCUMENTALES
        ---------------------------------------------------------- */}
        <div className="grid grid-cols-[1fr_0.6fr_0.6fr] items-center gap-2">
          <label className="text-xs font-semibold">Fecha documental</label>
          <SingleDatePicker label="Desde" value={fFileAfter} onChange={setFFileAfter} />
          <SingleDatePicker label="Hasta" value={fFileBefore} onChange={setFFileBefore} />
        </div>

        {/* ---------------------------------------------------------
            CONFIDENCIALIDAD
        ---------------------------------------------------------- */}
        <div>
          <label className="text-xs font-semibold">Confidencialidad</label>
          <select
            value={fSensitive}
            onChange={(e) => setFSensitive(e.target.value as any)}
            className="border rounded-lg p-2 text-sm"
          >
            <option value="all">Todos</option>
            <option value="delicate">Dato sensible</option>
            <option value="not_delicate">Normal</option>
          </select>
        </div>

        {/* ---------------------------------------------------------
            DISPONIBILIDAD
        ---------------------------------------------------------- */}
        <div>
          <label className="text-xs font-semibold">Disponibilidad</label>
          <select
            value={fAvail}
            onChange={(e) => setFAvail(e.target.value as any)}
            className="border rounded-lg p-2 text-sm"
          >
            <option value="all">Todos</option>
            <option value="available">Disponible</option>
            <option value="on_loan">Prestado</option>
            <option value="under_review">En revisión</option>
            <option value="unavailable">No disponible</option>
          </select>
        </div>

        {/* ---------------------------------------------------------
            ORDENAMIENTO
        ---------------------------------------------------------- */}
        <div className="flex flex-col gap-2 border p-3 rounded-xl bg-main-gray">
          <h3 className="text-sm font-semibold text-blue-600">Ordenar por</h3>

          {ORDER_FIELDS.map((f) => {
            const isAsc = fOrderBy === `${f.value}_asc`
            const isDesc = fOrderBy === `${f.value}_desc`
            const Icon = f.icon

            return (
              <div key={f.value} className="flex flex-row items-center gap-2">
                <Icon size={16} />
                <span className="flex-1 text-xs">{f.label}</span>

                <button
                  className={`p-1 rounded-2xl cursor-pointer ${
                    isAsc
                      ? "bg-blue-600 text-white"
                      : "hover:bg-white active:bg-main-gray"
                  }`}
                  onClick={() => applyOrder(f.value, "asc")}
                >
                  <ArrowUpAZ size={16} />
                </button>

                <button
                  className={`p-1 rounded-2xl cursor-pointer ${
                    isDesc
                      ? "bg-blue-600 text-white"
                      : "hover:bg-white active:bg-main-gray"
                  }`}
                  onClick={() => applyOrder(f.value, "desc")}
                >
                  <ArrowDownAZ size={16} />
                </button>
              </div>
            )
          })}
        </div>

        {/* ---------------------------------------------------------
            BOTONES / LOADING
        ---------------------------------------------------------- */}
        {loading ? (
          <div className="flex justify-center items-center gap-2">
            <span className="text-blue-600 font-medium">Generando archivo…</span>
            <Loader size={22} />
          </div>
        ) : (
          <div className="flex justify-end gap-4 pt-4">
            <button className="cancel" onClick={closeExportExcel}>Cancelar</button>
            <button className="create" onClick={handleExport}>Exportar</button>
          </div>
        )}

      </div>
    </Modal>
  )
}

export default ExportRecordFilesExcelModal
