import { useState, useEffect, useCallback } from 'react'
import {
  DiagnosisCatalog,
  DiagnosisCatalogOrderBy,
  DiagnosisCatalogPaginationResponse,
  OptionsGetDiagnosisCatalog,
} from '@/lib/api/models/diagnosis_catalog'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

export const useGetDiagnosisCatalog = ({
  initialPage = 1,
  initialPerPage = 20,
  initialIsActive = null,
  initialConcept = null,
  initialDetail = null,
  initialQuery = null,
  initialOrderBy = null,

}: OptionsGetDiagnosisCatalog = {}) => {

  // DATA
  const [diagnosisCatalog, setDiagnosisCatalog] = useState<DiagnosisCatalog[]>([])
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

  // FILTERS
  const [is_active, setIsActive] = useState<boolean | null>(initialIsActive)
  const [concept, setConcept] = useState<string | null>(initialConcept)
  const [detail, setDetail] = useState<string | null>(initialDetail)

  // SEARCH
  const [queryInput, setQueryInput] = useState(initialQuery ?? '')
  const [query, setQuery] = useState(initialQuery ?? '')
const [order_by, setOrderBy] = useState<DiagnosisCatalogOrderBy  | null>(
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
  const fetchDiagnosisCatalog = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (currentPage !== null) params.append('page', String(currentPage))
    if (pageSize !== null) params.append('per_page', String(pageSize))

    if (query) params.append('query', query)
    if (is_active !== null) params.append('is_active', String(is_active))

    if (concept) params.append('concept', concept)
    if (detail) params.append('detail', detail)
    if (order_by !== null) params.append('order_by', order_by)

    const url = `/diagnosis_catalog${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<DiagnosisCatalogPaginationResponse>(url, {
        method: 'GET',
        parse: 'json',
      } as any)

      if (
        !data ||
        typeof data !== 'object' ||
        !('diagnosis_catalog' in data)
      ) {
        throw new ApiError('Respuesta inválida del servidor.', 200, data)
      }

      setDiagnosisCatalog(
        Array.isArray(data.diagnosis_catalog)
          ? data.diagnosis_catalog
          : []
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
        setError(err.message || 'Error al obtener el catálogo de diagnóstico.')
      } else {
        setError('Error desconocido.')
      }
    } finally {
      setLoading(false)
    }
  }, [currentPage, pageSize, query, is_active, concept, detail,order_by])

  // AUTO FETCH
  useEffect(() => {
    fetchDiagnosisCatalog()
  }, [fetchDiagnosisCatalog])

  // PAGINATION CONTROLS
  const goNext = () => {
    if (nextPage !== null) setCurrentPage(nextPage)
  }

  const goPrev = () => {
    if (prevPage !== null) setCurrentPage(prevPage)
  }

  // FILTER SETTERS (reset page)
  const handleSetIsActive = (v: boolean | null) => {
    setIsActive(v)
    setCurrentPage(1)
  }

  const handleSetConcept = (v: string | null) => {
    setConcept(v)
    setCurrentPage(1)
  }

  const handleSetDetail = (v: string | null) => {
    setDetail(v)
    setCurrentPage(1)
  }

  return {
    diagnosisCatalog,
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

    order_by,setOrderBy: (v: DiagnosisCatalogOrderBy  | null) => {
              setOrderBy(v)
              setCurrentPage(1)
            },
    // Search
    query,
    queryInput,
    setQuery: setQueryInput,

    // Filters
    is_active,
    setIsActive: handleSetIsActive,

    concept,
    setConcept: handleSetConcept,

    detail,
    setDetail: handleSetDetail,

    // Refetch manual
    refetch: fetchDiagnosisCatalog,
  }
}
