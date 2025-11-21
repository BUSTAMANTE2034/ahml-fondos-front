import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useDeleteRecordFile = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteRecordFile = async (id: number) => {
    setLoading(true)
    setError(null)

    try {
      const res = await apiFetch<{ message: string }>(`/record-files/${id}`, {
        method: "DELETE",
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

  return { deleteRecordFile, loading, error }
}
