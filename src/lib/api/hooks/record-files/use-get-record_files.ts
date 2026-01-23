import { useState, useEffect, useCallback } from 'react'
import {
  RecordFile,
  RecordFilePaginatedResponse,
  GetRecordFilesOptions,
  RecordFileAvailability,
  RecordFileOrderByParam,
} from '@/lib/api/models/record-file'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetRecordFiles = ({
  initialPage = 1,
  initialPerPage = 25,

  // búsqueda global
  initialQuery = '',

  // filtros directos
  initialReferenceCode = '',
  initialPreviousReferenceCode = '',
  initialFileNumber = '',
  initialBoxNumber = '',

  // confidencialidad
  initialSensitive = 'all',

  // filtros por nombre
  initialFundName = '',
  initialSectionName = '',
  initialSeriesName = '',
  initialLocationName = '',
  initialDeteriorationName = '',
  initialTypologyName = '',

  // disponibilidad
  initialAvailabilityStatus = 'all',

  // fechas
  initialFileDateAfter = null,
  initialFileDateBefore = null,

  // ordenamiento
  initialOrderBy = null,
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
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPerPage)

  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)

  // =========================================================
  // FILTERS
  // =========================================================
  const [queryInput, setQueryInput] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)

  // directos
  const [reference_code, setReferenceCode] = useState(initialReferenceCode)
  const [previous_reference_code, setPreviousReferenceCode] = useState(
    initialPreviousReferenceCode
  )
  const [file_number, setFileNumber] = useState(initialFileNumber)
  const [box_number, setBoxNumber] = useState(initialBoxNumber)

  // confidencialidad
  const [sensitive, setSensitive] = useState<
    'all' | 'delicate' | 'not_delicate'
  >(initialSensitive)

  // por nombre
  const [fund_name, setFundName] = useState(initialFundName)
  const [section_name, setSectionName] = useState(initialSectionName)
  const [series_name, setSeriesName] = useState(initialSeriesName)
  const [location_name, setLocationName] = useState(initialLocationName)
  const [deterioration_name, setDeteriorationName] = useState(
    initialDeteriorationName
  )
  const [typology_name, setTypologyName] = useState(initialTypologyName)

  // disponibilidad
  const [availability_status, setAvailabilityStatus] = useState<
    RecordFileAvailability | 'all'
  >(initialAvailabilityStatus)

  // fechas
  const [file_date_after, setFileDateAfter] = useState(initialFileDateAfter)
  const [file_date_before, setFileDateBefore] = useState(initialFileDateBefore)

  // ordenamiento (incluye los nuevos box_number y file_number)
  const [order_by, setOrderBy] = useState<RecordFileOrderByParam | null>(
    initialOrderBy
  )

  // =========================================================
  // DEBOUNCE SEARCH
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
    params.append('page', String(currentPage))
    params.append('per_page', String(pageSize))

    if (query.trim() !== '') params.append('query', query.trim())

    if (reference_code.trim() !== '')
      params.append('reference_code', reference_code.trim())

    if (previous_reference_code.trim() !== '')
      params.append('previous_reference_code', previous_reference_code.trim())

    if (file_number.trim() !== '')
      params.append('file_number', file_number.trim())

    if (box_number.trim() !== '') params.append('box_number', box_number.trim())

    if (sensitive !== 'all') params.append('sensitive', sensitive)

    if (fund_name.trim() !== '') params.append('fund_name', fund_name.trim())
    if (section_name.trim() !== '')
      params.append('section_name', section_name.trim())
    if (series_name.trim() !== '')
      params.append('series_name', series_name.trim())
    if (location_name.trim() !== '')
      params.append('location_name', location_name.trim())
    if (deterioration_name.trim() !== '')
      params.append('deterioration_name', deterioration_name.trim())
    if (typology_name.trim() !== '')
      params.append('typology_name', typology_name.trim())

    if (availability_status !== 'all')
      params.append('availability_status', availability_status)

    if (file_date_after) params.append('file_date_after', file_date_after)
    if (file_date_before) params.append('file_date_before', file_date_before)

    if (order_by) params.append('order_by', order_by)

    const url = `/record-files?${params.toString()}`

    try {
      const data = await apiFetch<RecordFilePaginatedResponse>(url, {
        method: 'GET',
        parse: 'json',
      } as any)

      setRecordFiles(data.record_files ?? [])
   
      const p = data.pagination
      setTotalPages(p.pages)
      setHasNext(p.has_next)
      setHasPrev(p.has_prev)
      setNextPage(p.next_page)
      setPrevPage(p.prev_page)
      setTotalItems(p.total)
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Error desconocido.')
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    pageSize,
    query,

    reference_code,
    previous_reference_code,
    file_number,
    box_number,

    sensitive,

    fund_name,
    section_name,
    series_name,
    location_name,
    deterioration_name,
    typology_name,

    availability_status,

    file_date_after,
    file_date_before,

    order_by,
  ])

  useEffect(() => {
    fetchRecordFiles()
  }, [fetchRecordFiles])

  const resetPage = () => setCurrentPage(1)

  return {
    recordFiles,
    loading,
    error,
    totalItems,

    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goNext: () => nextPage !== null && setCurrentPage(nextPage),
    goPrev: () => prevPage !== null && setCurrentPage(prevPage),
    setPage: setCurrentPage,
    setPageSize,

    query,
    queryInput,
    setQuery: setQueryInput,

    reference_code,
    setReferenceCode: (v: string) => {
      setReferenceCode(v)
      resetPage()
    },
    previous_reference_code,
    setPreviousReferenceCode: (v: string) => {
      setPreviousReferenceCode(v)
      resetPage()
    },

    file_number,
    setFileNumber: (v: string) => {
      setFileNumber(v)
      resetPage()
    },

    box_number,
    setBoxNumber: (v: string) => {
      setBoxNumber(v)
      resetPage()
    },

    sensitive,
    setSensitive: (v: 'all' | 'delicate' | 'not_delicate') => {
      setSensitive(v)
      resetPage()
    },

    fund_name,
    setFundName: (v: string) => {
      setFundName(v)
      resetPage()
    },

    section_name,
    setSectionName: (v: string) => {
      setSectionName(v)
      resetPage()
    },

    series_name,
    setSeriesName: (v: string) => {
      setSeriesName(v)
      resetPage()
    },

    location_name,
    setLocationName: (v: string) => {
      setLocationName(v)
      resetPage()
    },

    deterioration_name,
    setDeteriorationName: (v: string) => {
      setDeteriorationName(v)
      resetPage()
    },

    typology_name,
    setTypologyName: (v: string) => {
      setTypologyName(v)
      resetPage()
    },

    availability_status,
    setAvailabilityStatus: (v: RecordFileAvailability | 'all') => {
      setAvailabilityStatus(v)
      resetPage()
    },

    file_date_after,
    file_date_before,
    setFileDateAfter: (v: string | null) => {
      setFileDateAfter(v)
      resetPage()
    },
    setFileDateBefore: (v: string | null) => {
      setFileDateBefore(v)
      resetPage()
    },

    order_by,
    setOrderBy: (v: RecordFileOrderByParam | null) => {
      setOrderBy(v)
      resetPage()
    },

    refetch: fetchRecordFiles,
  }
}
