import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import { RecordDiagnosisResponse } from '@/lib/api/models/record_diagnosis'

export const useDeleteRecordDiagnosis = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteRecordDiagnosis = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<RecordDiagnosisResponse>(
        `/record_diagnosis/${id}`,
        {
          method: 'DELETE',
        }
      )
      return data
    } catch (err: any) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Error desconocido.'
      )
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteRecordDiagnosis, loading, error }
}
