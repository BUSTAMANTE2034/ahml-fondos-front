import { useCallback, useEffect, useState } from 'react'
import {
  Location,
  LocationOrderByParam,
  LocationsPaginationResponse,
  OptionsGetLocations,
} from '@/lib/api/models/location'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetLocations = ({
  initialPage = 1,
  initialPerPage = 20,
  initialIsActive = null,
  initialOrderBy = null,
}: OptionsGetLocations = {}) => {

  // DATA
  const [locations, setLocations] = useState<Location[]>([])
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
const [order_by, setOrderBy] = useState<LocationOrderByParam | null>(
    initialOrderBy
  )
  // Debounce search
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])

  // MAIN FETCH
  const fetchLocations = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (currentPage !== null) params.append('page', String(currentPage))
    if (pageSize !== null) params.append('per_page', String(pageSize))

    if (query) params.append('query', query)
    if (is_active !== null) params.append('is_active', String(is_active))
    if (order_by !== null) params.append('order_by', order_by)

    const url = `/locations${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<LocationsPaginationResponse>(url, {
        method: 'GET',
        parse: 'json',
      } as any)

      setLocations(data.locations)

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
  }, [currentPage, pageSize, query, is_active,order_by])

  // Auto fetch
  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  // Pagination helpers
  const goNext = () => nextPage !== null && setCurrentPage(nextPage)
  const goPrev = () => prevPage !== null && setCurrentPage(prevPage)

  // is_active setter → reset page
  const handleSetIsActive = (v: boolean | null) => {
    setIsActive(v)
    setCurrentPage(1)
  }

  return {
    locations,
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
    order_by,
    setOrderBy: (v: LocationOrderByParam | null) => {
          setOrderBy(v)
          setCurrentPage(1)
        },
    // search
    query,
    queryInput,
    setQuery: setQueryInput,

    // filters
    is_active,
    setIsActive: handleSetIsActive,

    // manual refetch
    refetch: fetchLocations,
  }
}
