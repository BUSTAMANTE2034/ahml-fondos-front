import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import { MovementHistoryResponse } from "@/lib/api/models/movement"

export const useDeleteMovement = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deleteMovement = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<MovementHistoryResponse>(`/movement-history/${id}`, {
        method: "DELETE",
      })
      return data
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Error desconocido.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteMovement, loading, error }
}
