// =========================
//        BOX
// =========================
export interface Box {
  id: number
  box_number: string
  physical_location_id: number
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

  physical_location?: {
    id: number
    code: string
    description?: string | null
    user_id: number | null
    is_active: boolean
    created_at: string
    updated_at: string
    deleted_at?: string | null
  }

  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateBox {
  box_number: string
  physical_location_id?: number | null
  description?: string | null
  is_active?: boolean
}

export interface UpdateBox {
  box_number?: string
  physical_location_id?: number | null
  description?: string | null
  is_active?: boolean
}

export interface BoxResponse {
  box?: Box
  message: string
}

export interface OptionsGetBoxes {
  initialPage?: number
  initialPerPage?: number
  initialIsActive?: boolean | null
  initialBoxNumber?: string
  initialPhysicalLocationId?: number
}

export interface BoxesPaginationResponse {
  message: string
  boxes: Box[]
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
