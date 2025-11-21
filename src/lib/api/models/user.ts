export interface User {
  id: number
  employee_id: string
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'manager' | 'archivist' | 'visitor'
  is_active: boolean
  first_login: boolean
  last_login: string
  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateUser {
  employee_id: string
  first_name: string
  last_name: string
  email: string
  role: 'admin' | 'manager' | 'archivist' | 'visitor'
}
export interface UpdateUser {
  first_name?: string
  last_name?: string
  email?: string
  role?: 'admin' | 'manager' | 'archivist' | 'visitor'
  is_active?: boolean
  employee_id?: string
  password?: string
  password_confirmation?: string
}
export interface UserResponse {
  user?: User
  message: string
}

export interface ChangePasswordPost {
  current_password: string
  new_password: string
  new_password_confirmation: string
}

export interface ChangePasswordResponse {
  message: string
}

export interface ResetPasswordPost {
  id: number
}
export interface ResetPasswordResponse {
  message: string
}

export interface OptionsGetUser{
  initialPage?:number|null
  initialPerPage ?:number|null
  initialIsActive?:boolean|null
  initialRole?:string|null
}
export interface UsersPaginationResponse {
  message: string
  users: User[]
  pagination: {
    total: number
    pages: number
    current_page: number
    per_page: number
    has_next: boolean
    has_prev: boolean
    next_page: number | null
    prev_page: number | null
  }
}
