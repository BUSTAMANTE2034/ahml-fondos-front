import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { RecordFile } from '@/lib/api/models/record-file'

export const useGetRecordFileById = (id: number | null) => {
  const [recordFile, setRecordFile] = useState<RecordFile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await apiFetch<{ record_file: RecordFile }>(
          `/record-files/${id}`,
          { method: 'GET', parse: 'json' }
        )

        setRecordFile(data.record_file)
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : 'Error al obtener el expediente.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  return {
    recordFile,
    loading,
    error,
  }
}
