import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import { PhysicalLocation, PhysicalLocationsPaginationResponse } from "@/lib/api/models/physical_location"

/**
 * Búsqueda ligera de ubicaciones físicas (PhysicalLocations) por query.
 * Ideal para selects, autocompletados y búsqueda rápida.
 *
 * - Solo usa `query`
 * - per_page fijo en 15
 * - debounce de 500ms
 * - sin paginación compleja
 */
export const useSearchPhysicalLocations = (query: string | undefined, is_active: boolean | null = null) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<PhysicalLocation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // --------------------------------------------------------
  // DEBOUNCE
  // --------------------------------------------------------
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query ?? ""), 500)
    return () => clearTimeout(id)
  }, [query])

  // --------------------------------------------------------
  // FETCH SIMPLE
  // --------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced ?? "")
      params.append("per_page", "15") // fijo

      if (is_active !== null) {
        params.append("is_active", String(is_active))
      }

      const url = `/physical_locations?${params.toString()}`

      try {
        const data = await apiFetch<PhysicalLocationsPaginationResponse>(url, {
          method: "GET",
          parse: "json",
        })

        setResults(data.physical_locations ?? [])
      } catch (err: any) {
        if (err instanceof ApiError) {
          setError(err.message || "Error al buscar ubicaciones físicas.")
        } else {
          setError("Error inesperado al buscar ubicaciones físicas.")
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
