import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import {
  UpdateMovementHistory,
  MovementHistoryResponse,
} from "@/lib/api/models/movement"

export const useUpdateMovement = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateMovement = async (id: number | null, payload: UpdateMovementHistory) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<MovementHistoryResponse>(`/movement-history/${id}`, {
        method: "PUT",
        body: payload,
      })
      return data
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Error desconocido.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateMovement, loading, error }
}
