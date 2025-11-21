import { useCallback, useEffect, useState } from "react"
import {
  MovementHistory,
  MovementStatus,
  MovementsPaginatedResponse,
  GetMovementsOptions,
} from "@/lib/api/models/movement"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useGetMovements = ({
  initialPage = 1,
  initialPerPage = 20,
  initialRecordFileId = null,
  initialUserId = null,
  initialOriginStatus = null,
  initialDestinationStatus = null,
}: GetMovementsOptions = {}) => {
  const [movements, setMovements] = useState<MovementHistory[]>([])
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
  const [record_file_id, setRecordFileId] = useState<number | null>(initialRecordFileId)
  const [moved_by_user_id, setMovedByUserId] = useState<number | null>(initialUserId)
  const [origin_status, setOriginStatus] = useState<MovementStatus | null>(initialOriginStatus)
  const [destination_status, setDestinationStatus] = useState<MovementStatus | null>(
    initialDestinationStatus
  )

  const fetchMovements = useCallback(
    async ({ signal }: { signal?: AbortSignal } = {}) => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("page", String(currentPage))
      params.append("per_page", String(pageSize))

      if (record_file_id !== null)
        params.append("record_file_id", String(record_file_id))

      if (moved_by_user_id !== null)
        params.append("moved_by_user_id", String(moved_by_user_id))

      if (origin_status) params.append("origin_status", origin_status)
      if (destination_status) params.append("destination_status", destination_status)

      const url = `/movement-history${params.toString() ? `?${params}` : ""}`

      try {
        const data = await apiFetch<MovementsPaginatedResponse>(url, {
          method: "GET",
          parse: "json",
          signal,
        } as any)

        setMovements(data.movements)

        const pag = data.pagination
        setTotalPages(pag.pages)
        setHasNext(pag.has_next)
        setHasPrev(pag.has_prev)
        setNextPage(pag.next_page)
        setPrevPage(pag.prev_page)
      } catch (err: any) {
        if (err?.name === "AbortError") return
        setError(err instanceof ApiError ? err.message : "Error desconocido.")
      } finally {
        setLoading(false)
      }
    },
    [currentPage, pageSize, record_file_id, moved_by_user_id, origin_status, destination_status]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchMovements({ signal: controller.signal })
    return () => controller.abort()
  }, [fetchMovements])

  const goNext = () => nextPage && setCurrentPage(nextPage)
  const goPrev = () => prevPage && setCurrentPage(prevPage)

  return {
    movements,
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

    // filtros
    record_file_id,
    setRecordFileId,

    moved_by_user_id,
    setMovedByUserId,

    origin_status,
    setOriginStatus,

    destination_status,
    setDestinationStatus,

    // refetch
    refetch: () => fetchMovements(),
  }
}
