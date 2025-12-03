import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import {
  Section,
  SectionsPaginationResponse
} from "@/lib/api/models/section"

/**
 * Búsqueda ligera de Secciones por query.
 * Ideal para autocompletar (AsyncSelect, combos, autocomplete fields).
 *
 * - Solo usa `query`
 * - per_page fijo en 10
 * - No usa paginación, filtros ni fechas
 * - Debounce de 500ms
 */
export const useSearchSections = (query: string,
  is_active: boolean | null = null) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<Section[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // -------------------------------------------------------
  //  DEBOUNCE
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
      // Si está vacío, limpiar resultados
      if (!debounced.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced)
      params.append("per_page", "10") // <= límite igual que catalog-keys & funds
        if (is_active !== null) {
        params.append("is_active", String(is_active))
      }

      const url = `/sections?${params.toString()}`

      try {
        const data = await apiFetch<SectionsPaginationResponse>(url, {
          method: "GET",
          parse: "json",
        })

        setResults(data.sections ?? [])
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || "Error al buscar secciones.")
        } else {
          setError("Error inesperado al buscar secciones.")
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
