import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import {
  Series,
  SeriesPaginationResponse
} from "@/lib/api/models/series"

/**
 * Búsqueda ligera de Series por query.
 * Uso ideal para selects, autocompletados y búsqueda en vivo.
 *
 * - Se basa solo en `query`
 * - Debounce de 500ms
 * - per_page fijo en 10
 * - No incluye filtros por fechas ni is_active
 */
export const useSearchSeries = (query: string) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<Series[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ----------------------------------------------
  // DEBOUNCE (idéntico a los otros hooks)
  // ----------------------------------------------
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(id)
  }, [query])

  // ----------------------------------------------
  // FETCH SIMPLE (sin paginación lógica)
  // ----------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      // Si no hay query, limpiar resultados
      if (!debounced.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced)
      params.append("per_page", "10") // <= fijo, como tus otras búsquedas
      params.append('is_active', String(true))

      const url = `/series?${params.toString()}`

      try {
        const data = await apiFetch<SeriesPaginationResponse>(url, {
          method: "GET",
          parse: "json"
        })

        setResults(data.series ?? [])
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || "Error al buscar series.")
        } else {
          setError("Error inesperado al buscar series.")
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
