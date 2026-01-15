import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import {
  PhysicalLocationDetailResponse,
  PhysicalLocationBoxDetail,
  PhysicalLocationDetail,
} from '@/lib/api/models/physical_location'

interface UseGetPhysicalLocationDetailOptions {
  code?: string | null
  autoFetch?: boolean
}

export const useGetPhysicalLocationDetail = ({
  code,
  autoFetch = true,
}: UseGetPhysicalLocationDetailOptions) => {

  // DATA
  const [location, setLocation] =
    useState<PhysicalLocationDetail | null>(null)

  const [boxes, setBoxes] =
    useState<PhysicalLocationBoxDetail[]>([])

  const [summary, setSummary] =
    useState<PhysicalLocationDetailResponse['summary'] | null>(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // MAIN FETCH
  const fetchDetail = useCallback(async () => {
    if (!code) return

    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<PhysicalLocationDetailResponse>(
        `/physical_locations/${code}/detail`,
        {
          method: 'GET',
          parse: 'json',
        } as any
      )

      setLocation(data.physical_location)
      setBoxes(data.boxes)
      setSummary(data.summary)

    } catch (err: any) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Error al obtener el detalle de la estantería.'
      )
    } finally {
      setLoading(false)
    }
  }, [code])

  // AUTO FETCH
  useEffect(() => {
    if (autoFetch) {
      fetchDetail()
    }
  }, [fetchDetail, autoFetch])

  return {
    // data
    location,
    boxes,
    summary,

    // state
    loading,
    error,

    // actions
    refetch: fetchDetail,
  }
}
