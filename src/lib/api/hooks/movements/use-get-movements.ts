import { useState, useEffect, useCallback } from "react"
import {
  MovementHistory,
  MovementsPaginatedResponse,
  GetMovementsOptions,
  MovementStatus,
} from "@/lib/api/models/movement"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useGetMovements = ({
  initialPage = 1,
  initialPerPage = 20,
}: GetMovementsOptions = {}) => {

  // DATA
  const [movements, setMovements] = useState<MovementHistory[]>([])
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
  const [movedAfter, setMovedAfter] = useState<string | null>(null)
  const [movedBefore, setMovedBefore] = useState<string | null>(null)

  const [originStatus, setOriginStatus] = useState<MovementStatus | null>(null)
  const [destinationStatus, setDestinationStatus] = useState<MovementStatus | null>(null)

  // SEARCH interna
  const [queryInput, setQueryInput] = useState("")
  const [query, setQuery] = useState("")

  // DEBOUNCE QUERY
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])

  // MAIN FETCH
  const fetchMovements = useCallback(async () => {
    setLoading(true)
    setError(null)

    const params = new URLSearchParams()

    if (currentPage !== null) params.append("page", String(currentPage))
    if (pageSize !== null) params.append("per_page", String(pageSize))

    if (query) params.append("query", query)
    if (movedAfter) params.append("moved_after", movedAfter)
    if (movedBefore) params.append("moved_before", movedBefore)

    if (originStatus) params.append("origin_status", originStatus)
    if (destinationStatus) params.append("destination_status", destinationStatus)

    const url = `/movement-history${params.toString() ? `?${params}` : ""}`

    try {
      const data = await apiFetch<MovementsPaginatedResponse>(url, {
        method: "GET",
        parse: "json",
      } as any)

      if (!data || !("movements" in data)) {
        throw new ApiError("Respuesta inválida.", 200, data)
      }

      setMovements(data.movements)

      const p = data.pagination
      setTotalPages(p.pages)
      setHasNext(p.has_next)
      setHasPrev(p.has_prev)
      setNextPage(p.next_page)
      setPrevPage(p.prev_page)

    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message || "Error al obtener movimientos.")
      } else {
        setError("Error desconocido.")
      }
    } finally {
      setLoading(false)
    }
  }, [
    currentPage,
    pageSize,
    query,
    movedAfter,
    movedBefore,
    originStatus,
    destinationStatus,
  ])

  // AUTO FETCH
  useEffect(() => {
    fetchMovements()
  }, [fetchMovements])

  // Pagination
  const goNext = () => nextPage && setCurrentPage(nextPage)
  const goPrev = () => prevPage && setCurrentPage(prevPage)

  // FILTER SETTERS → reset page
  const handleSetMovedAfter = (v: string | null) => {
    setMovedAfter(v)
    setCurrentPage(1)
  }

  const handleSetMovedBefore = (v: string | null) => {
    setMovedBefore(v)
    setCurrentPage(1)
  }

  const handleSetOriginStatus = (v: MovementStatus | null) => {
    setOriginStatus(v)
    setCurrentPage(1)
  }

  const handleSetDestinationStatus = (v: MovementStatus | null) => {
    setDestinationStatus(v)
    setCurrentPage(1)
  }

  return {
    movements,
    loading,
    error,

    // Pagination
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

    // Search
    query,
    queryInput,
    setQuery: setQueryInput,

    // Filters
    movedAfter,
    movedBefore,
    setMovedAfter: handleSetMovedAfter,
    setMovedBefore: handleSetMovedBefore,

    originStatus,
    destinationStatus,
    setOriginStatus: handleSetOriginStatus,
    setDestinationStatus: handleSetDestinationStatus,

    // manual refetch
    refetch: fetchMovements,
  }
}
