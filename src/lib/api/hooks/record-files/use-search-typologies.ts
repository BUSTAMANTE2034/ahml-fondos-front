import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

import {
  Typology,
  TypologiesPaginationResponse
} from "@/lib/api/models/typology"

/**
 * Búsqueda ligera de tipologías por query.
 * Ideal para autocompletado, selects y filtrado en vivo.
 *
 * - Solo usa `query`
 * - Debounce de 500ms
 * - per_page fijo en 10
 * - Sin paginación real ni parámetros adicionales
 */
export const useSearchTypologies = (query: string,
  is_active: boolean | null = null) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<Typology[]>([])
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
      // Si query vacío → limpiar
      if (!debounced.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced)
      params.append("per_page", "10") // como en los otros search hooks
        if (is_active !== null) {
        params.append("is_active", String(is_active))
      }

      const url = `/typologies?${params.toString()}`

      try {
        const data = await apiFetch<TypologiesPaginationResponse>(url, {
          method: "GET",
          parse: "json"
        })

        setResults(data.typologies ?? [])
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || "Error al buscar tipologías.")
        } else {
          setError("Error inesperado al buscar tipologías.")
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
