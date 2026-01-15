// =========================
//    PHYSICAL LOCATION
// =========================
export interface PhysicalLocation {
  id: number
  code: string
  description?: string | null
  user_id: number | null
  is_active: boolean

  user?: {
    id: number
    employee_id?: string
    first_name: string
    last_name: string
    email: string
  } | null

  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreatePhysicalLocation {
  code: string
  description?: string | null
  is_active?: boolean
}

export interface UpdatePhysicalLocation {
  code?: string
  description?: string | null
  is_active?: boolean
}

export interface PhysicalLocationResponse {
  physical_location?: PhysicalLocation
  message: string
}

export interface OptionsGetPhysicalLocations {
  initialPage?: number
  initialPerPage?: number
  initialIsActive?: boolean | null
  initialCode?: string
}

export interface PhysicalLocationsPaginationResponse {
  message: string
  physical_locations: PhysicalLocation[]
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