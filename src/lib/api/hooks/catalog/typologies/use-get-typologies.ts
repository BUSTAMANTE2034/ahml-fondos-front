import { useCallback, useEffect, useState } from 'react'
import {
  Typology,
  TypologiesPaginationResponse,
  OptionsGetTypologies,
} from '@/lib/api/models/typology'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetTypologies = ({
  initialPage = 1,
  initialPerPage = 20,
  initialIsActive = null,
}: OptionsGetTypologies = {}) => {

  // DATA
  const [typologies, setTypologies] = useState<Typology[]>([])
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

  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])

  // MAIN FETCH
  const fetchTypologies = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (currentPage !== null) params.append('page', String(currentPage))
    if (pageSize !== null) params.append('per_page', String(pageSize))

    if (query) params.append('query', query)
    if (is_active !== null) params.append('is_active', String(is_active))

    const url = `/typologies${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<TypologiesPaginationResponse>(url, {
        method: 'GET',
        parse: 'json',
      } as any)

      setTypologies(data.typologies)

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

  // Auto fetch on dependencies change
  useEffect(() => {
    fetchTypologies()
  }, [fetchTypologies])

  // Pagination actions
  const goNext = () => nextPage !== null && setCurrentPage(nextPage)
  const goPrev = () => prevPage !== null && setCurrentPage(prevPage)

  // IS ACTIVE setter
  const handleSetIsActive = (v: boolean | null) => {
    setIsActive(v)
    setCurrentPage(1)
  }

  return {
    typologies,
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
    is_active,
    setIsActive: handleSetIsActive,

    // refetch manual
    refetch: fetchTypologies,
  }
}
