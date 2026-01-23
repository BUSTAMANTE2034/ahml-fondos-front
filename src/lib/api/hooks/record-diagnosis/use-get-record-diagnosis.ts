import { useState, useEffect, useCallback } from 'react'
import {
  RecordDiagnosis,
  RecordDiagnosisPaginationResponse,
  OptionsGetRecordDiagnosis,
} from '@/lib/api/models/record_diagnosis'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetRecordDiagnosis = ({
  initialPage = 1,
  initialPerPage = 20,
  initialRecordFileId = null,
  initialUserId = null,
  initialStartDate = null,
  initialEndDate = null,
  initialQuery = '',
  initialDetail = '',
}: OptionsGetRecordDiagnosis & { initialQuery?: string } = {}) => {
  // ==========================================================
  // DATA
  // ==========================================================
  const [recordDiagnoses, setRecordDiagnoses] = useState<RecordDiagnosis[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ==========================================================
  // PAGINATION
  // ==========================================================
  const [currentPage, setCurrentPage] = useState<number | null>(initialPage)
  const [pageSize, setPageSize] = useState<number | null>(initialPerPage)
    const [totalItems, setTotalItems] = useState(0)

  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)

  // ==========================================================
  // FILTERS
  // ==========================================================
  const [record_file_id, setRecordFileId] = useState<number | null>(
    initialRecordFileId,
  )
  const [user_id, setUserId] = useState<number | null>(initialUserId)
  const [start_date, setStartDate] = useState<string | null>(initialStartDate)
  const [end_date, setEndDate] = useState<string | null>(initialEndDate)

  // ==========================================================
  // SEARCH (igual que Funds)
  // ==========================================================
  const [queryInput, setQueryInput] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [diagnosisDetail, setDiagnosisDetail] = useState(initialDetail)
  // Debounce del search
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)

    return () => clearTimeout(id)
  }, [queryInput])

  // ==========================================================
  // MAIN FETCH
  // ==========================================================
  const fetchRecordDiagnosis = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (currentPage !== null) params.append('page', String(currentPage))
    if (pageSize !== null) params.append('per_page', String(pageSize))

    if (query) params.append('query', query)

    if (record_file_id !== null)
      params.append('record_file_id', String(record_file_id))

    if (user_id !== null) params.append('user_id', String(user_id))

    if (start_date) params.append('start_date', start_date)
    if (end_date) params.append('end_date', end_date)
    if (diagnosisDetail) params.append('diagnosis_detail', diagnosisDetail)

    const url = `/record_diagnosis${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<RecordDiagnosisPaginationResponse>(url, {
        method: 'GET',
        parse: 'json',
      } as any)

      if (!data || typeof data !== 'object' || !('record_diagnoses' in data)) {
        throw new ApiError('Respuesta inválida del servidor.', 200, data)
      }

      setRecordDiagnoses(
        Array.isArray(data.record_diagnoses) ? data.record_diagnoses : [],
      )

      const p = data.pagination
      setTotalPages(p.pages)
      setTotalItems(p.total)
      setHasNext(p.has_next)
      setHasPrev(p.has_prev)
      setNextPage(p.next_page)
      setPrevPage(p.prev_page)
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al obtener revisiones.')
      } else {
        setError('Error desconocido.')
      }
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    pageSize,
    query,
    record_file_id,
    user_id,
    start_date,
    end_date,
    diagnosisDetail
  ])

  // ==========================================================
  // AUTO FETCH
  // ==========================================================
  useEffect(() => {
    fetchRecordDiagnosis()
  }, [fetchRecordDiagnosis])

  // ==========================================================
  // PAGINATION CONTROLS
  // ==========================================================
  const goNext = () => {
    if (nextPage !== null) setCurrentPage(nextPage)
  }

  const goPrev = () => {
    if (prevPage !== null) setCurrentPage(prevPage)
  }

  // ==========================================================
  // FILTER SETTERS → reset page
  // ==========================================================
  const handleSetRecordFileId = (id: number | null) => {
    setRecordFileId(id)
    setCurrentPage(1)
  }

  const handleSetUserId = (id: number | null) => {
    setUserId(id)
    setCurrentPage(1)
  }

  const handleSetStartDate = (date: string | null) => {
    setStartDate(date)
    setCurrentPage(1)
  }

  const handleSetEndDate = (date: string | null) => {
    setEndDate(date)
    setCurrentPage(1)
  }

  // ==========================================================
  // RETURN
  // ==========================================================
  return {
    recordDiagnoses,
    loading,
    error,
totalItems,
    // Pagination
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    setPage: setCurrentPage,
    setPageSize,

    goNext,
    goPrev,

    // Search
    query,
    queryInput,
    setQuery: setQueryInput,

    // Filters
    record_file_id,
    setRecordFileId: handleSetRecordFileId,

    user_id,
    setUserId: handleSetUserId,

    start_date,
    end_date,
    setStartDate: handleSetStartDate,
    setEndDate: handleSetEndDate,

    diagnosisDetail,
    setDiagnosisDetail: (v: string) => {
      setDiagnosisDetail(v)
      setCurrentPage(1)
    },

    // Refetch manual
    refetch: fetchRecordDiagnosis,
  }
}
