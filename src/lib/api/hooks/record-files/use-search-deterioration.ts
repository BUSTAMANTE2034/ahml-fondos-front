import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

import {
  Deterioration,
  DeteriorationsPaginationResponse
} from "@/lib/api/models/deterioration"

/**
 * Búsqueda ligera de deterioros por query.
 * Ideal para autocompletado (AsyncSelect, combobox, select buscables, etc.)
 *
 * - Usa solo `query`
 * - Debounce de 500ms
 * - per_page fijo en 10
 * - Sin paginación ni filtros
 */
export const useSearchDeteriorations = (query: string | undefined,
  is_active: boolean | null = null) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<Deterioration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // -------------------------------------------------------
  // DEBOUNCE (igual a todos los otros search hooks)
  // -------------------------------------------------------
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query ?? ""), 500)
    return () => clearTimeout(id)
  }, [query])

  // -------------------------------------------------------
  // FETCH SIMPLE (sin paginación)
  // -------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      // si no hay texto, limpia resultados
      /*if (!(debounced ?? "").trim()) {
        setResults([])
        return
      }*/


      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced ?? "")

      params.append("per_page", "15") // <= igual que los otros hooks search
        if (is_active !== null) {
        params.append("is_active", String(is_active))
      }
      const url = `/deteriorations?${params.toString()}`

      try {
        const data = await apiFetch<DeteriorationsPaginationResponse>(url, {
          method: "GET",
          parse: "json"
        })

        setResults(data.deteriorations ?? [])
      } catch (err: any) {
        if (err instanceof ApiError) {
          setError(err.message || "Error al buscar deterioros.")
        } else {
          setError("Error inesperado al buscar deterioros.")
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
    error
  }
}
