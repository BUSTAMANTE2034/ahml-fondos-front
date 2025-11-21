import { useState, useEffect, useCallback } from "react"
import {
  RecordFile,
  RecordFilePaginatedResponse,
  GetRecordFilesOptions,
} from "@/lib/api/models/record-file"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useGetRecordFiles = ({
  initialPage = 1,
  initialPerPage = 20,

  // filtros base
  initialQuery = "",
  initialFundId = null,
  initialSectionId = null,
  initialSeriesId = null,
  initialLocationId = null,
  initialDeteriorationStatusId = null,
  initialAvailabilityStatus = null,

  // fechas
  initialCreatedAfter = null,
  initialCreatedBefore = null,
  initialFileDateAfter = null,
  initialFileDateBefore = null,

  // tipologías (una o varias)
  initialTypologyIds = [],

  // ordenamiento
  initialOrderBy = null,
  initialOrderDirection = "desc",
}: GetRecordFilesOptions = {}) => {
  // =========================================================
  // DATA
  // =========================================================
  const [recordFiles, setRecordFiles] = useState<RecordFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // =========================================================
  // PAGINATION
  // =========================================================
  const [currentPage, setCurrentPage] = useState<number>(initialPage)
  const [pageSize, setPageSize] = useState<number>(initialPerPage)

  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)

  // =========================================================
  // FILTERS
  // =========================================================
  const [queryInput, setQueryInput] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)

  const [fund_id, setFundId] = useState<number | null>(initialFundId)
  const [section_id, setSectionId] = useState<number | null>(initialSectionId)
  const [series_id, setSeriesId] = useState<number | null>(initialSeriesId)
  const [location_id, setLocationId] = useState<number | null>(initialLocationId)

  const [deterioration_status_id, setDeteriorationStatusId] = useState<number | null>(
    initialDeteriorationStatusId
  )

  const [availability_status, setAvailabilityStatus] = useState<string | null>(
    initialAvailabilityStatus
  )

  // fechas
  const [created_after, setCreatedAfter] = useState<string | null>(initialCreatedAfter)
  const [created_before, setCreatedBefore] = useState<string | null>(initialCreatedBefore)
  const [file_date_after, setFileDateAfter] = useState<string | null>(
    initialFileDateAfter
  )
  const [file_date_before, setFileDateBefore] = useState<string | null>(
    initialFileDateBefore
  )

  // tipologías (solo es válido 1 para BE, pero soportamos múltiples)
  const [typology_ids, setTypologyIds] = useState<number[]>(initialTypologyIds)

  // ordenamiento
  const [order_by, setOrderBy] = useState<string | null>(initialOrderBy)
  const [order_direction, setOrderDirection] =
    useState<"asc" | "desc">(initialOrderDirection)

  // =========================================================
  // SEARCH DEBOUNCE
  // =========================================================
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])

  // =========================================================
  // FETCH PRINCIPAL
  // =========================================================
  const fetchRecordFiles = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    params.append("page", String(currentPage))
    params.append("per_page", String(pageSize))

    // texto libre
    if (query.trim() !== "") params.append("query", query.trim())

    // referencias
    if (fund_id !== null) params.append("fund_id", String(fund_id))
    if (section_id !== null) params.append("section_id", String(section_id))
    if (series_id !== null) params.append("series_id", String(series_id))
    if (location_id !== null) params.append("location_id", String(location_id))

    // deterioro
    if (deterioration_status_id !== null)
      params.append("deterioration_status_id", String(deterioration_status_id))

    // disponibilidad
    if (availability_status)
      params.append("availability_status", availability_status)

    // fechas
    if (created_after) params.append("created_after", created_after)
    if (created_before) params.append("created_before", created_before)
    if (file_date_after) params.append("file_date_after", file_date_after)
    if (file_date_before) params.append("file_date_before", file_date_before)

    // tipologías múltiples -> backend SÓLO usa typology_id (1)
    if (typology_ids.length > 0) {
      params.append("typology_id", String(typology_ids[0]))
    }

    // ordenamiento
    if (order_by) params.append("order_by", order_by)
    if (order_direction) params.append("order_direction", order_direction)

    const url = `/record-files${params.toString() ? `?${params}` : ""}`

    try {
      const data = await apiFetch<RecordFilePaginatedResponse>(url, {
        method: "GET",
        parse: "json",
      } as any)

      if (!data || typeof data !== "object" || !("record_files" in data)) {
        throw new ApiError("Respuesta inválida del servidor.", 200, data)
      }

      setRecordFiles(Array.isArray(data.record_files) ? data.record_files : [])

      const p = data.pagination
      setTotalPages(p.pages)
      setHasNext(p.has_next)
      setHasPrev(p.has_prev)
      setNextPage(p.next_page)
      setPrevPage(p.prev_page)
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Error desconocido.")
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    pageSize,
    query,

    fund_id,
    section_id,
    series_id,
    location_id,
    deterioration_status_id,
    availability_status,

    created_after,
    created_before,
    file_date_after,
    file_date_before,

    typology_ids,
    order_by,
    order_direction,
  ])

  // =========================================================
  // AUTO-FETCH
  // =========================================================
  useEffect(() => {
    fetchRecordFiles()
  }, [fetchRecordFiles])

  // =========================================================
  // PAGINATION ACTIONS
  // =========================================================
  const goNext = () => nextPage !== null && setCurrentPage(nextPage)
  const goPrev = () => prevPage !== null && setCurrentPage(prevPage)

  // =========================================================
  // FILTER HELPERS (reset page)
  // =========================================================
  const handleSetFundId = (v: number | null) => {
    setFundId(v)
    setCurrentPage(1)
  }

  const handleSetSectionId = (v: number | null) => {
    setSectionId(v)
    setCurrentPage(1)
  }

  const handleSetSeriesId = (v: number | null) => {
    setSeriesId(v)
    setCurrentPage(1)
  }

  const handleSetLocationId = (v: number | null) => {
    setLocationId(v)
    setCurrentPage(1)
  }

  const handleSetDeteriorationStatusId = (v: number | null) => {
    setDeteriorationStatusId(v)
    setCurrentPage(1)
  }

  const handleSetAvailabilityStatus = (v: string | null) => {
    setAvailabilityStatus(v)
    setCurrentPage(1)
  }

  const handleSetCreatedAfter = (v: string | null) => {
    setCreatedAfter(v)
    setCurrentPage(1)
  }

  const handleSetCreatedBefore = (v: string | null) => {
    setCreatedBefore(v)
    setCurrentPage(1)
  }

  const handleSetFileDateAfter = (v: string | null) => {
    setFileDateAfter(v)
    setCurrentPage(1)
  }

  const handleSetFileDateBefore = (v: string | null) => {
    setFileDateBefore(v)
    setCurrentPage(1)
  }

  // tipologías
  const handleSetTypologies = (arr: number[]) => {
    setTypologyIds(arr)
    setCurrentPage(1)
  }

  // =========================================================
  // RETURN
  // =========================================================
  return {
    recordFiles,
    loading,
    error,

    // pagination
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goNext,
    goPrev,
    setPage: setCurrentPage,
    setPageSize,

    // search
    query,
    queryInput,
    setQuery: setQueryInput,

    // filters
    fund_id,
    setFundId: handleSetFundId,

    section_id,
    setSectionId: handleSetSectionId,

    series_id,
    setSeriesId: handleSetSeriesId,

    location_id,
    setLocationId: handleSetLocationId,

    deterioration_status_id,
    setDeteriorationStatusId: handleSetDeteriorationStatusId,

    availability_status,
    setAvailabilityStatus: handleSetAvailabilityStatus,

    // fechas
    created_after,
    created_before,
    setCreatedAfter: handleSetCreatedAfter,
    setCreatedBefore: handleSetCreatedBefore,

    file_date_after,
    file_date_before,
    setFileDateAfter: handleSetFileDateAfter,
    setFileDateBefore: handleSetFileDateBefore,

    // tipologías
    typology_ids,
    setTypologyIds: handleSetTypologies,

    // order
    order_by,
    setOrderBy,
    order_direction,
    setOrderDirection,

    // manual refetch
    refetch: fetchRecordFiles,
  }
}
