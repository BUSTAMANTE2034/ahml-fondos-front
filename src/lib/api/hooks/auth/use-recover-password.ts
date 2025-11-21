import { useState } from "react"
import { RecoverPasswordPost, RecoverPasswordResponse } from "@/lib/api/models/auth"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"

export const useRecoverPassword = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [temporaryPassword, setTemporaryPassword] = useState<string | null>(null)

  const recoverPassword = async (data: RecoverPasswordPost) => {
    setLoading(true)
    setError(null)
    setMessage(null)
    setTemporaryPassword(null)

    try {
      const res = await apiFetch<RecoverPasswordResponse>("/auth/recover-password", {
        method: "POST",
        parse: "json",
        body: JSON.stringify(data)
      } as any)

      setMessage(res.message)

      if (res.temporary_password) {
        setTemporaryPassword(res.temporary_password)
      }

      return true

    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Error desconocido.")
      }
      return false

    } finally {
      setLoading(false)
    }
  }

  return {
    recoverPassword,
    loading,
    error,
    message,
    temporaryPassword
  }
}
