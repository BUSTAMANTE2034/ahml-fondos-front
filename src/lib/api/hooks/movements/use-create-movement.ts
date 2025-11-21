import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import {
  CreateMovementHistory,
  MovementHistoryResponse,
} from "@/lib/api/models/movement"

export const useCreateMovement = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createMovement = async (payload: CreateMovementHistory) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<MovementHistoryResponse>("/movement-history", {
        method: "POST",
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

  return { createMovement, loading, error }
}
