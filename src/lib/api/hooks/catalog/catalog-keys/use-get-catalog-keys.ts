import { useCallback, useEffect, useState } from 'react'
import {
  Catalog_Key,
  Catalog_KeysPaginationResponse,
  CatalogKeyOrderByParam,
  OptionsGetCatalog_Key,
} from '@models/catalog-key'
import { ApiError } from '@/lib/types/errors'
import { apiFetch } from '@/lib/types/client'

export const useGetCatalogKeys = ({
  initialPage = 1,
  initialPerPage = 20,
  initialIsActive = null,
  initialOrderBy = null,
}: OptionsGetCatalog_Key = {}) => {
  // DATA
  const [catalog_keys, setCatalogKeys] = useState<Catalog_Key[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // FILTERS
  const [current_page, setCurrentPage] = useState<number | null>(initialPage)
  const [per_page, setPerPage] = useState<number | null>(initialPerPage)
  const [is_active, setIsActive] = useState<boolean | null>(initialIsActive)
  const [entity_type, setEntityType] = useState<string[]>([])

  // SEARCH
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')

  // Pagination Info
  const [total, setTotal] = useState<number | null>(0)
  const [pages, setPages] = useState<number | null>(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)
const [order_by, setOrderBy] = useState<CatalogKeyOrderByParam | null>(
    initialOrderBy
  )
  // Input debounce
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])

  // MAIN FETCH FUNCTION
  const getCatalogKeys = useCallback(async () => {
    setError(null)
    setLoading(true)

    const params = new URLSearchParams()
    if (current_page !== null) params.append('page', String(current_page))
    if (per_page !== null) params.append('per_page', String(per_page))
    if (is_active !== null) params.append('is_active', String(is_active))
    if (entity_type !== null) params.append('entity_type', String(entity_type))
    if (query) params.append('query', query)
    if (order_by) params.append('order_by', order_by)  

    const url = `/catalog-keys${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<Catalog_KeysPaginationResponse>(url, {
        method: 'GET',
      })

      const catalogKeys = Array.isArray(data.catalog_keys)
        ? data.catalog_keys
        : []
      const pagination = data.pagination
      // SET DATA
      setCatalogKeys(catalogKeys)
      setTotal(pagination.total)
      setPages(pagination.pages)
      setPerPage(pagination.per_page)
      setCurrentPage(pagination.current_page)
      setPrevPage(pagination.prev_page)
      setNextPage(pagination.next_page)
      setHasNext(pagination.has_next)
      setHasPrev(pagination.has_prev)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al obtener clave de catálogo.')
      } else {
        setError('Error desconocido.')
      }
    } finally {
      setLoading(false)
    }
  }, [current_page, per_page, query, is_active,entity_type,order_by])

  // AUTO REQUEST
  useEffect(() => {
    getCatalogKeys()
  }, [getCatalogKeys])

  // PAGE CONTROLLERS
  const goNext = useCallback(() => {
    if (nextPage !== null) setCurrentPage(nextPage)
  }, [nextPage])

  const goPrev = useCallback(() => {
    if (prevPage !== null) setCurrentPage(prevPage)
  }, [prevPage])

  return {
    catalog_keys,
    loading,
    error,

    // Pagination
    current_page,
    total,
    pages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,

    // Filters
    is_active,
    setIsActive: (v: boolean | null) => {
      setIsActive(v)
      setCurrentPage(1)
    },
    entity_type,
    setEntityType: (types: string[]) => {
  setEntityType(types)
  setCurrentPage(1)
},
order_by,
    setOrderBy: (v: CatalogKeyOrderByParam| null) => {
      setOrderBy(v)
      setCurrentPage(1)
    },



    // Search
    query,
    queryInput,
    setQuery: setQueryInput,

    // Navigation
    goNext,
    goPrev,

    // Refetch
    getCatalogKeys,
  }
}
