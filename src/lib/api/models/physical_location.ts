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
export type PhysicalLocationOrderByParam =
  | "code_asc"
  | "code_desc"
  | "description_asc"
  | "description_desc"
  | "created_at_asc"
  | "created_at_desc"
  | "updated_at_asc"
  | "updated_at_desc"

export interface OptionsGetPhysicalLocations {
  initialPage?: number
  initialPerPage?: number
  initialIsActive?: boolean | null
  initialCode?: string
   initialOrderBy?: PhysicalLocationOrderByParam | null
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

// =========================
//   BOX DETAIL (ESTANTERÍA)
// =========================
export interface PhysicalLocationBoxDetail {
  id: number
  box_number: string
  description?: string | null
  total_record_files: number
  classification_codes: string[]
}

// =========================
//   PHYSICAL LOCATION DETAIL
// =========================
export interface PhysicalLocationDetail {
  id: number
  code: string
  description?: string | null
  is_active: boolean
}

// =========================
//   RESPONSE
// =========================
export interface PhysicalLocationDetailResponse {
  message: string
  physical_location: PhysicalLocationDetail
  boxes: PhysicalLocationBoxDetail[]
  summary: {
    total_boxes: number
    total_record_files: number
  }
}
