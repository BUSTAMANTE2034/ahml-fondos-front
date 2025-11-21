import { useState } from "react"
import { apiFetch } from "@/lib/types/client"
import { ApiError } from "@/lib/types/errors"
import { ChangePasswordResponse } from "@models/auth"

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changePassword = async (body: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }): Promise<ChangePasswordResponse> => {
    setLoading(true)
    setError(null)

    try {
      const res = await apiFetch<ChangePasswordResponse>("/auth/change-password", {
        method: "POST",
        body,
      })

      return res
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError("Error desconocido al cambiar contraseña.")
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { changePassword, loading, error }
}
