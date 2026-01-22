import { useState } from 'react'
import { apiFetch } from '@/lib/types/client'
import { ApiError } from '@/lib/types/errors'
import {
  CreateRecordDiagnosis,
  RecordDiagnosisResponse,
} from '@/lib/api/models/record_diagnosis'

export const useCreateRecordDiagnosis = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRecordDiagnosis = async (
    payload: CreateRecordDiagnosis
  ) => {
     if (!payload?.record_file_id) {
    return
  }
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<RecordDiagnosisResponse>(
        '/record_diagnosis',
        {
          method: 'POST',
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

  return { createRecordDiagnosis, loading, error }
}
