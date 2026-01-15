    import { useState, useEffect } from "react"
    import { apiFetch } from "@/lib/types/client"
    import { ApiError } from "@/lib/types/errors"
    import {
      Catalog_Key,
      Catalog_KeysPaginationResponse
    } from "@models/catalog-key"

    export const useSearchCatalogKeys = (query: string | undefined,
      is_active: boolean | null = null,
      entity_type: string = "series") => {
      const [debounced, setDebounced] = useState(query)
      const [results, setResults] = useState<Catalog_Key[]>([])
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState<string | null>(null)

      // -------------------------------------------------------
      //  DEBOUNCE (idéntico a useSearchFunds)
      // -------------------------------------------------------
      useEffect(() => {
        const id = setTimeout(() => setDebounced(query ?? ""), 500)
        return () => clearTimeout(id)
      }, [query])

      // -------------------------------------------------------
      //  FETCH SIMPLE
      // -------------------------------------------------------
      useEffect(() => {
        const fetchData = async () => {
          setLoading(true)
          setError(null)

          const params = new URLSearchParams()
          params.append("query", debounced ?? "")
          params.append("per_page", "15")
          params.append("entity_type", entity_type)

          if (is_active !== null) {
            params.append("is_active", String(is_active))
          }

          const url = `/catalog-keys?${params.toString()}`

          try {
            const data = await apiFetch<Catalog_KeysPaginationResponse>(url, {
              method: "GET",
              parse: "json"
            })

            setResults(data.catalog_keys ?? [])
          } catch (err) {
            if (err instanceof ApiError) {
              setError(err.message || "Error al buscar claves de catálogo.")
            } else {
              setError("Error inesperado al buscar claves de catálogo.")
            }
          } finally {
            setLoading(false)
          }
        }

        fetchData()
      }, [debounced, entity_type, is_active])

      return {
        results,
        loading,
        error
      }
    }
