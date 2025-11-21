import { useState, useEffect, useCallback } from 'react'
import {
  Fund,
  FundPaginationResponse,
  OptionsGetFunds,
} from '@/lib/api/models/fund'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetFunds = ({
  initialPage = 1,
  initialPerPage = 20,
  initialIsActive = null,
}: OptionsGetFunds = {}) => {

  // DATA
  const [funds, setFunds] = useState<Fund[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // PAGINATION
  const [currentPage, setCurrentPage] = useState<number | null>(initialPage)
  const [pageSize, setPageSize] = useState<number | null>(initialPerPage)

  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)

  // FILTERS
  const [is_active, setIsActive] = useState<boolean | null>(initialIsActive)
  const [start_date, setStartDate] = useState<string | null>(null)
  const [end_date, setEndDate] = useState<string | null>(null)

  // SEARCH
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')

  // Debounce del search
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])

  // MAIN FETCH (simple)
  const fetchFunds = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (currentPage !== null) params.append('page', String(currentPage))
    if (pageSize !== null) params.append('per_page', String(pageSize))

    if (query) params.append('query', query)
    if (is_active !== null) params.append('is_active', String(is_active))

    if (start_date) params.append('start_date', start_date)
    if (end_date) params.append('end_date', end_date)

    const url = `/funds${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<FundPaginationResponse>(url, {
        method: 'GET',
        parse: 'json',
      } as any)

      if (!data || typeof data !== 'object' || !('funds' in data)) {
        throw new ApiError('Respuesta inválida del servidor.', 200, data)
      }

      setFunds(Array.isArray(data.funds) ? data.funds : [])

      const p = data.pagination
      setTotalPages(p.pages)
      setHasNext(p.has_next)
      setHasPrev(p.has_prev)
      setNextPage(p.next_page)
      setPrevPage(p.prev_page)

    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al obtener fondos.')
      } else {
        setError('Error desconocido.')
      }
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, query, is_active, start_date, end_date])

  // Auto fetch
  useEffect(() => {
    fetchFunds()
  }, [fetchFunds])

  // Cambio de página
  const goNext = () => {
    if (nextPage !== null) setCurrentPage(nextPage)
  }

  const goPrev = () => {
    if (prevPage !== null) setCurrentPage(prevPage)
  }

  // FILTER SETTERS → reset page
  const handleSetStartDate = (date: string | null) => {
    setStartDate(date)
    setCurrentPage(1)
  }

  const handleSetEndDate = (date: string | null) => {
    setEndDate(date)
    setCurrentPage(1)
  }

  const handleSetIsActive = (v: boolean | null) => {
    setIsActive(v)
    setCurrentPage(1)
  }

  return {
    funds,
    loading,
    error,

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
    is_active,
    setIsActive: handleSetIsActive,

    start_date,
    end_date,
    setStartDate: handleSetStartDate,
    setEndDate: handleSetEndDate,

    // Refetch manual
    refetch: fetchFunds,
  }
}
