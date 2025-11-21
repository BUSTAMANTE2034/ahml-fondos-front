import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

import {
  Fund,
  FundPaginationResponse
} from "@/lib/api/models/fund"

/**
 * Búsqueda ligera de fondos por query.
 * Ideal para autocompletado (AsyncSelect, combos, etc.)
 *
 * - Busca por el campo "query"
 * - PerPage fijo en 10
 * - Sin filtros extra
 * - Con debounce de 500ms
 */
export const useSearchFunds = (query: string) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<Fund[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // -------------------------------------------------------
  //  DEBOUNCE (idéntico a useSearchCatalogKeys)
  // -------------------------------------------------------
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(id)
  }, [query])

  // -------------------------------------------------------
  //  FETCH SIMPLE
  // -------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      // si está vacío, limpiar
      if (!debounced.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced)
      params.append("per_page", "10") // <= igual que catalog-keys

      const url = `/funds?${params.toString()}`

      try {
        const data = await apiFetch<FundPaginationResponse>(url, {
          method: "GET",
          parse: "json",
        })

        setResults(data.funds ?? [])
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || "Error al buscar fondos.")
        } else {
          setError("Error inesperado al buscar fondos.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [debounced])

  return {
    results,
    loading,
    error,
  }
}
