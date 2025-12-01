import { useState } from "react"
import { LoanResponse } from "@/lib/api/models/loan"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useReceiveLoanRecord = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const receiveLoanRecord = async (id: number | null) => {
    if (!id) return
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<LoanResponse>(`/loans/receive-by-record-file/${id}`, {
        method: "PUT",
      })
      return data
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Error desconocido.")
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { receiveLoanRecord , loading, error }
}
