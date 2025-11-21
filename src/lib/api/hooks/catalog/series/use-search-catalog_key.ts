import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import {
  Catalog_Key,
  Catalog_KeysPaginationResponse
} from "@models/catalog-key"

export const useSearchCatalogKeys = (query: string) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<Catalog_Key[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debounce igual que tu fund-search
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), 500)
    return () => clearTimeout(id)
  }, [query])

  // Fetch simple (sin paginación)
  useEffect(() => {
    const fetchData = async () => {
      // NO buscar si está vacío
      if (!debounced.trim()) {
        setResults([])
        return
      }

      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.append("query", debounced)
      params.append("per_page", "10")

      // ⭐ Aquí enviamos SIEMPRE entity_type=fund
      params.append("entity_type", "series")

      const url = `/catalog-keys?${params.toString()}`

      try {
        const data = await apiFetch<Catalog_KeysPaginationResponse>(url, {
          method: "GET",
          parse: "json"
        })

        // lista simple
        setResults(data.catalog_keys ?? [])
      } catch (err) {
        setError("Error al buscar claves de catálogo.")
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
