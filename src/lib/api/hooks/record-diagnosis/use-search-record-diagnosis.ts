import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import {
  DiagnosisCatalog,
  DiagnosisCatalogPaginationResponse,
} from '@/lib/api/models/diagnosis_catalog'

export const useSearchDiagnosisCatalog = (
  query: string | undefined,
  is_active: boolean | null = true
) => {
  const [debounced, setDebounced] = useState(query)
  const [results, setResults] = useState<DiagnosisCatalog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // -------------------------------------------------------
  // DEBOUNCE (idéntico a los otros search)
  // -------------------------------------------------------
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query ?? ''), 500)
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
      params.append('query', debounced ?? '')
      params.append('per_page', '15')

      if (is_active !== null) {
        params.append('is_active', String(is_active))
      }

      const url = `/diagnosis_catalog?${params.toString()}`

      try {
        const data = await apiFetch<DiagnosisCatalogPaginationResponse>(url, {
          method: 'GET',
          parse: 'json',
        })

        setResults(data.diagnosis_catalog ?? [])
      } catch (err) {
        if (err instanceof ApiError) {
          setError(
            err.message || 'Error al buscar catálogo de diagnóstico.'
          )
        } else {
          setError(
            'Error inesperado al buscar catálogo de diagnóstico.'
          )
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
