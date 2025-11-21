export interface Deterioration {
  id: number
  name: string
  description: string | null
  user_id: number | null
  is_active: boolean

  user: {
    id: number
    employee_id: string
    first_name: string
    last_name: string
    email: string
  } | null

  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateDeterioration {
  name: string
  description?: string
  is_active?: boolean
}

export interface UpdateDeterioration {
  name?: string
  description?: string
  is_active?: boolean
}

export interface DeteriorationResponse {
  deterioration?: Deterioration
  message: string
}

export interface OptionsGetDeteriorations {
  initialPage?: number
  initialPerPage?: number
  initialIsActive?: boolean | null
}

export interface DeteriorationsPaginationResponse {
  message: string
  deteriorations: Deterioration[]
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
