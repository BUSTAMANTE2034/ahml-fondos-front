import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import { RecordFileResponse, UpdateRecordFile } from "@models/record-file"

export const useUpdateRecordFile = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateRecordFile = async (id: number, body: UpdateRecordFile) => {
    setLoading(true)
    setError(null)

    try {
      const res = await apiFetch<RecordFileResponse>(`/record-files/${id}`, {
        method: "PUT",
        body,
      })
      return res
    } catch (err: any) {
      if (err instanceof ApiError) setError(err.message)
      else setError("Error desconocido.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateRecordFile, loading, error }
}
