import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

import { Box, BoxesPaginationResponse } from "@/lib/api/models/box"

/**
 * Búsqueda ligera de cajas por query.
 * Ideal para AsyncSearchSelect.
 *
 * - Usa `query`
 * - per_page fijo en 15
 * - debounce de 500ms
 * - filtro opcional por is_active
 */
export const useSearchBoxes = (
  query: string | undefined,
  is_active: boolean | null = null
) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<Box[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // -------------------------------------------------------
  // DEBOUNCE
  // -------------------------------------------------------
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query ?? ""), 500)
    return () => clearTimeout(id)
  }, [query])

  // -------------------------------------------------------
  // FETCH SIMPLE
  // -------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced ?? "")
      params.append("per_page", "15")

      if (is_active !== null) {
        params.append("is_active", String(is_active))
      }

      const url = `/boxes?${params.toString()}`

      try {
        const data = await apiFetch<BoxesPaginationResponse>(url, {
          method: "GET",
          parse: "json",
        })

        setResults(data.boxes ?? [])
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || "Error al buscar cajas.")
        } else {
          setError("Error inesperado al buscar cajas.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [debounced, is_active])

  return {
    results,
    loading,
    error,
  }
}
