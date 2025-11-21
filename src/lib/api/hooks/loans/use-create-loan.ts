import { useState } from "react"
import { CreateLoan, LoanResponse } from "@/lib/api/models/loan"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useCreateLoan = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createLoan = async (payload: CreateLoan) => {
    setLoading(true)
    setError(null)

    try {
      const data = await apiFetch<LoanResponse>("/loans", {
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

  return { createLoan, loading, error }
}
