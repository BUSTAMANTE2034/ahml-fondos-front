import { useState } from "react"
import { UpdateLoan, LoanResponse } from "@/lib/api/models/loan"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useUpdateLoan = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateLoan = async (id: number | null, payload: UpdateLoan) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<LoanResponse>(`/loans/${id}`, {
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

  return { updateLoan, loading, error }
}
