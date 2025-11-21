import { User } from '@models/user'
export interface PostLogin {
  email: string
  password: string
  remember_me?:boolean
}

export interface LoginResponse {
  message: string
  user: User
}
export interface LogoutResponse {
  message: string
  status: boolean
}
export interface CheckSessionResponse {
  message?: string
  error?: string
  status_code: boolean
  user?: User
}

export interface ChangePasswordPost {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface ChangePasswordResponse {
  message: string
}


export interface RecoverPasswordPost {
  user_id: number
}

export interface RecoverPasswordResponse {
  message: string
  temporary_password?: string   // solo aparece si falla el envío de email
  error?: string
}
