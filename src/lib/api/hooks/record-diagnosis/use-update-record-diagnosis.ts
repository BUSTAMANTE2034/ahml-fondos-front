import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import {
  UpdateRecordDiagnosis,
  RecordDiagnosisResponse,
} from '@/lib/api/models/record_diagnosis'

export const useUpdateRecordDiagnosis = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateRecordDiagnosis = async (
    id: number | null,
    payload: UpdateRecordDiagnosis
  ) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<RecordDiagnosisResponse>(
        `/record_diagnosis/${id}`,
        {
          method: 'PUT',
          body: payload,
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

  return { updateRecordDiagnosis, loading, error }
}
