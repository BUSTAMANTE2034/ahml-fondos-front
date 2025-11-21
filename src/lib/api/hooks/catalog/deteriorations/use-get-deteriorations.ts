import { useCallback, useEffect, useState } from 'react'
import {
  Deterioration,
  DeteriorationsPaginationResponse,
  OptionsGetDeteriorations,
} from '@/lib/api/models/deterioration'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetDeteriorations = ({
  initialPage = 1,
  initialPerPage = 20,
  initialIsActive = null,
}: OptionsGetDeteriorations = {}) => {

  // DATA
  const [deteriorations, setDeteriorations] = useState<Deterioration[]>([])
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

  // MAIN FETCH
  const fetchDeteriorations = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (currentPage !== null) params.append('page', String(currentPage))
    if (pageSize !== null) params.append('per_page', String(pageSize))

    if (query) params.append('query', query)
    if (is_active !== null) params.append('is_active', String(is_active))

    const url = `/deteriorations${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<DeteriorationsPaginationResponse>(url, {
        method: 'GET',
        parse: 'json',
      } as any)

      setDeteriorations(data.deteriorations)

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
  }, [currentPage, pageSize, query, is_active])

  // Auto fetch
  useEffect(() => {
    fetchDeteriorations()
  }, [fetchDeteriorations])

  // Pagination helpers
  const goNext = () => nextPage !== null && setCurrentPage(nextPage)
  const goPrev = () => prevPage !== null && setCurrentPage(prevPage)

  // is_active setter → resets pagination
  const handleSetIsActive = (v: boolean | null) => {
    setIsActive(v)
    setCurrentPage(1)
  }

  return {
    deteriorations,
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
    setPage: setCurrentPage,
    setPageSize,

    // búsqueda
    query,
    queryInput,
    setQuery: setQueryInput,

    // filtros
    is_active,
    setIsActive: handleSetIsActive,

    // refetch
    refetch: fetchDeteriorations,
  }
}
