import { useCallback, useEffect, useState } from 'react'
import {
  Series,
  SeriesPaginationResponse,
  OptionsGetSeries,
  SeriesOrderByParam
} from '@/lib/api/models/series'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetSeries = ({
  initialPage = 1,
  initialPerPage = 20,
  initialIsActive = null,
  initialOrderBy = null,
}: OptionsGetSeries = {}) => {

  const [series, setSeries] = useState<Series[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // paginación
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPerPage)
  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)

  // filtros
  const [is_active, setIsActive] = useState<boolean | null>(initialIsActive)
  const [start_date, setStartDate] = useState<string | null>(null)
  const [end_date, setEndDate] = useState<string | null>(null)

  // búsqueda libre
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')
const [order_by, setOrderBy] = useState<SeriesOrderByParam | null>(
    initialOrderBy
  )
  // debounce
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])

  // fetch SIN abort controller
  const fetchSeries = useCallback(
    async () => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append('page', String(currentPage))
      params.append('per_page', String(pageSize))

      if (query) params.append('query', query)
      if (is_active !== null) params.append('is_active', String(is_active))
      if (start_date) params.append('start_date', start_date)
      if (end_date) params.append('end_date', end_date)
      if (order_by) params.append('order_by', order_by)

      const url = `/series${params.toString() ? `?${params}` : ''}`

      try {
        const data = await apiFetch<SeriesPaginationResponse>(url, {
          method: 'GET',
          parse: 'json',
        } as any)

        setSeries(Array.isArray(data.series) ? data.series : [])

        const p = data.pagination
        setTotalPages(p.pages)
        setHasNext(p.has_next)
        setHasPrev(p.has_prev)
        setNextPage(p.next_page)
        setPrevPage(p.prev_page)

      } catch (err: any) {
        setError(err instanceof ApiError ? err.message : 'Error desconocido.')
      } finally {
        setLoading(false)
      }
    },
    [currentPage, pageSize, query, is_active, start_date, end_date,order_by]
  )

  // auto fetch
  useEffect(() => {
    fetchSeries()
  }, [fetchSeries])

  // navegación
  const goNext = () => nextPage && setCurrentPage(nextPage)
  const goPrev = () => prevPage && setCurrentPage(prevPage)

  // filtros handlers
  const handleSetActive = (v: boolean | null) => {
    setIsActive(v)
    setCurrentPage(1)
  }

  const handleSetStart = (v: string | null) => {
    setStartDate(v)
    setCurrentPage(1)
  }

  const handleSetEnd = (v: string | null) => {
    setEndDate(v)
    setCurrentPage(1)
  }

  return {
    series,
    loading,
    error,

    // paginación
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goNext,
    goPrev,
order_by,
    setOrderBy: (v: SeriesOrderByParam | null) => {
      setOrderBy(v)
      setCurrentPage(1)
    },

    setPage: setCurrentPage,
    setPageSize,

    // búsqueda
    query,
    queryInput,
    setQuery: setQueryInput,

    // filtros
    is_active,
    setIsActive: handleSetActive,

    start_date,
    end_date,
    setStartDate: handleSetStart,
    setEndDate: handleSetEnd,

    // refetch manual
    refetch: fetchSeries,
  }
}
