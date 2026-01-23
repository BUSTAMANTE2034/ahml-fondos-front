import { useCallback, useEffect, useState } from 'react'
import {
  Section,
  SectionsPaginationResponse,
  OptionsGetSections
} from '@/lib/api/models/section'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetSections = ({
  initialPage = 1,
  initialPerPage = 20,
  initialIsActive = null,
}: OptionsGetSections = {}) => {

  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPerPage)

  const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
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

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])

  // FETCH (sin AbortController)
  const fetchSections = useCallback(
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

      const url = `/sections${params.toString() ? `?${params}` : ''}`

      try {
        const data = await apiFetch<SectionsPaginationResponse>(url, {
          method: 'GET',
          parse: 'json'
        } as any)

        setSections(Array.isArray(data.sections) ? data.sections : [])

        const p = data.pagination
        setTotalPages(p.pages)
        setTotalItems(p.total)
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
    [currentPage, pageSize, query, is_active, start_date, end_date]
  )

  // AUTO REQUEST
  useEffect(() => {
    fetchSections()
  }, [fetchSections])

  // PAGINATION
  const goNext = () => nextPage && setCurrentPage(nextPage)
  const goPrev = () => prevPage && setCurrentPage(prevPage)

  // FILTER HANDLERS
  const handleSetIsActive = (v: boolean | null) => {
    setIsActive(v)
    setCurrentPage(1)
  }

  const handleSetStartDate = (v: string | null) => {
    setStartDate(v)
    setCurrentPage(1)
  }

  const handleSetEndDate = (v: string | null) => {
    setEndDate(v)
    setCurrentPage(1)
  }

  return {
    sections,
    loading,
    error,

    totalItems,

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

    query,
    queryInput,
    setQuery: setQueryInput,

    is_active,
    setIsActive: handleSetIsActive,

    start_date,
    end_date,
    setStartDate: handleSetStartDate,
    setEndDate: handleSetEndDate,

    refetch: fetchSections,
  }
}
