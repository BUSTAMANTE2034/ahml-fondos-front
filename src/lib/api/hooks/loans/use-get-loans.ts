import { useState, useEffect, useCallback } from 'react'
import {
  Loan,
  LoansPaginatedResponse,
  GetLoansOptions,
} from '@/lib/api/models/loan'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetLoans = ({
  initialPage = 1,
  initialPerPage = 20,
  initialActive = null,
}: GetLoansOptions = {}) => {

  // DATA
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // PAGINATION
  const [currentPage, setCurrentPage] = useState<number | null>(initialPage)
  const [pageSize, setPageSize] = useState<number | null>(initialPerPage)
    const [totalItems, setTotalItems] = useState(0)

  const [totalPages, setTotalPages] = useState(1)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)

  // FILTERS (igual estilo que funds)
  const [active, setActive] = useState<boolean | null>(initialActive)
  const [loadedAfter, setLoadedAfter] = useState<string | null>(null)
  const [loadedBefore, setLoadedBefore] = useState<string | null>(null)
  const [returnedAfter, setReturnedAfter] = useState<string | null>(null)
  const [returnedBefore, setReturnedBefore] = useState<string | null>(null)

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
  const fetchLoans = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (currentPage !== null) params.append('page', String(currentPage))
    if (pageSize !== null) params.append('per_page', String(pageSize))

    if (query) params.append('query', query)
    if (active !== null) params.append('active', String(active))

    if (loadedAfter) params.append('loaded_after', loadedAfter)
    if (loadedBefore) params.append('loaded_before', loadedBefore)
    if (returnedAfter) params.append('returned_after', returnedAfter)
    if (returnedBefore) params.append('returned_before', returnedBefore)

    const url = `/loans${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<LoansPaginatedResponse>(url, {
        method: 'GET',
        parse: 'json',
      } as any)

      if (!data || typeof data !== 'object' || !('loans' in data)) {
        throw new ApiError('Respuesta inválida del servidor.', 200, data)
      }

      setLoans(Array.isArray(data.loans) ? data.loans : [])

      const p = data.pagination
      setTotalPages(p.pages)
      setTotalItems(p.total)
      setHasNext(p.has_next ?? false)
      setHasPrev(p.has_prev ?? false)
      setNextPage(p.next_page ?? null)
      setPrevPage(p.prev_page ?? null)

    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al obtener préstamos.')
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
    active,
    loadedAfter,
    loadedBefore,
    returnedAfter,
    returnedBefore,
  ])

  // Auto fetch
  useEffect(() => {
    fetchLoans()
  }, [fetchLoans])

  // Cambio de página
  const goNext = () => {
    if (nextPage !== null) setCurrentPage(nextPage)
  }

  const goPrev = () => {
    if (prevPage !== null) setCurrentPage(prevPage)
  }

  // FILTER SETTERS → reset page
  const handleSetActive = (v: boolean | null) => {
    setActive(v)
    setCurrentPage(1)
  }

  const handleSetLoadedAfter = (v: string | null) => {
    setLoadedAfter(v)
    setCurrentPage(1)
  }

  const handleSetLoadedBefore = (v: string | null) => {
    setLoadedBefore(v)
    setCurrentPage(1)
  }

  const handleSetReturnedAfter = (v: string | null) => {
    setReturnedAfter(v)
    setCurrentPage(1)
  }

  const handleSetReturnedBefore = (v: string | null) => {
    setReturnedBefore(v)
    setCurrentPage(1)
  }

  return {
    loans,
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
    active,
    setActive: handleSetActive,

    loadedAfter,
    loadedBefore,
    returnedAfter,
    returnedBefore,

    setLoadedAfter: handleSetLoadedAfter,
    setLoadedBefore: handleSetLoadedBefore,
    setReturnedAfter: handleSetReturnedAfter,
    setReturnedBefore: handleSetReturnedBefore,

    // manual refetch
    refetch: fetchLoans,
  }
}
