import { useCallback, useEffect, useState } from "react"
import {
  Loan,
  LoansPaginatedResponse,
  GetLoansOptions,
} from "@/lib/api/models/loan"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useGetLoans = ({
  initialPage = 1,
  initialPerPage = 20,
  initialQuery = "",
  initialLoadedAfter = null,
  initialLoadedBefore = null,
  initialReturnedAfter = null,
  initialReturnedBefore = null,
  initialActive = null,
}: GetLoansOptions = {}) => {
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // paginación
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [pageSize, setPageSize] = useState(initialPerPage)
  const [totalPages, setTotalPages] = useState(1)

  // filtros
  const [query, setQuery] = useState(initialQuery)
  const [loadedAfter, setLoadedAfter] = useState<string | null>(initialLoadedAfter)
  const [loadedBefore, setLoadedBefore] = useState<string | null>(initialLoadedBefore)
  const [returnedAfter, setReturnedAfter] = useState<string | null>(initialReturnedAfter)
  const [returnedBefore, setReturnedBefore] = useState<string | null>(initialReturnedBefore)
  const [active, setActive] = useState<boolean | null>(initialActive)

  const fetchLoans = useCallback(
    async ({ signal }: { signal?: AbortSignal } = {}) => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("page", String(currentPage))
      params.append("per_page", String(pageSize))

      if (query) params.append("query", query)
      if (loadedAfter) params.append("loaded_after", loadedAfter)
      if (loadedBefore) params.append("loaded_before", loadedBefore)
      if (returnedAfter) params.append("returned_after", returnedAfter)
      if (returnedBefore) params.append("returned_before", returnedBefore)

      if (active !== null) params.append("active", active ? "true" : "false")

      const url = `/loans${params.size ? "?" + params.toString() : ""}`

      try {
        const data = await apiFetch<LoansPaginatedResponse>(url, {
          method: "GET",
          signal,
          parse: "json",
        } as any)

        setLoans(data.loans)
        setTotalPages(data.pagination.pages)
      } catch (err: any) {
        if (err?.name === "AbortError") return
        setError(err instanceof ApiError ? err.message : "Error desconocido.")
      } finally {
        setLoading(false)
      }
    },
    [
      currentPage,
      pageSize,
      query,
      loadedAfter,
      loadedBefore,
      returnedAfter,
      returnedBefore,
      active,
    ]
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchLoans({ signal: controller.signal })
    return () => controller.abort()
  }, [fetchLoans])

  return {
    loans,
    loading,
    error,

    // paginación
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,

    // filtros
    query,
    setQuery,

    loadedAfter,
    setLoadedAfter,

    loadedBefore,
    setLoadedBefore,

    returnedAfter,
    setReturnedAfter,

    returnedBefore,
    setReturnedBefore,

    active,
    setActive,

    refetch: () => fetchLoans(),
  }
}
