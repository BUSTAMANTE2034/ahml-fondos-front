import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import { CreateRecordFile, RecordFileResponse } from "@models/record-file"

export const useCreateRecordFile = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createRecordFile = async (body: CreateRecordFile) => {
    setLoading(true)
    setError(null)

    try {
      const res = await apiFetch<RecordFileResponse>("/record-files", {
        method: "POST",
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

  return { createRecordFile, loading, error }
}
