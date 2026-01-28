import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'

type ReorderParams = {
  fund_id?: string
  section_id?: string
  series_id?: string
  box_id?: string
}

type ReorderResponse = {
  message: string
  updated_records: number
  groups_affected?: number
}

export const useReorderRecordFiles = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reorderRecordFiles = async (params: ReorderParams = {}) => {
    setLoading(true)
    setError(null)

    try {
      const searchParams = new URLSearchParams()

      if (params.fund_id) searchParams.append('fund_id', params.fund_id)

      if (params.section_id)
        searchParams.append('section_id', params.section_id)

      if (params.series_id) searchParams.append('series_id', params.series_id)

      if (params.box_id) searchParams.append('box_id', params.box_id)

      const query = searchParams.toString()
      const url = query
        ? `/record-files/reorder-by-file-date?${query}`
        : `/record-files/reorder-by-file-date`

      const res = await apiFetch<ReorderResponse>(url, {
        method: 'PUT',
      })

      return res
    } catch (err: any) {
      if (err instanceof ApiError) setError(err.message)
      else setError('Error desconocido.')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    reorderRecordFiles,
    loading,
    error,
  }
}
