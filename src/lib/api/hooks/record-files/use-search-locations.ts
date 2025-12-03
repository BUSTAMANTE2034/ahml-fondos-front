import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import {
  Location,
  LocationsPaginationResponse
} from "@/lib/api/models/location"

/**
 * Búsqueda ligera de ubicaciones (Locations) por query.
 * Ideal para selects, autocompletados y búsqueda rápida.
 *
 * - Solo usa `query`
 * - per_page fijo en 10
 * - debounce de 500ms
 * - sin paginación, sin filtros de is_active
 */
export const useSearchLocations = (query: string,
  is_active: boolean | null = null) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<Location[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --------------------------------------------------------
  // DEBOUNCE
  // --------------------------------------------------------
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(id)
  }, [query])

  // --------------------------------------------------------
  // FETCH SIMPLE
  // --------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      // si el query está vacío → limpiar resultados
      if (!debounced.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced)
      params.append("per_page", "10") // mismo estilo siempre
        if (is_active !== null) {
        params.append("is_active", String(is_active))
      }

      const url = `/locations?${params.toString()}`

      try {
        const data = await apiFetch<LocationsPaginationResponse>(url, {
          method: "GET",
          parse: "json"
        })

        setResults(data.locations ?? [])
      } catch (err: any) {
        if (err instanceof ApiError) {
          setError(err.message || "Error al buscar ubicaciones.")
        } else {
          setError("Error inesperado al buscar ubicaciones.")
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
