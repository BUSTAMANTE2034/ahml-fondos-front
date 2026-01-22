export interface Location {
  id: number
  name: string
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

export interface CreateLocation {
  name: string
  is_active?: boolean
}

export interface UpdateLocation {
  name?: string
  is_active?: boolean
}

export interface LocationResponse {
  location?: Location
  message: string
}export type LocationOrderByParam =
  | "name_asc"
  | "name_desc"
  | "updated_at_asc"
  | "updated_at_desc"

export interface OptionsGetLocations {
  initialPage?: number
  initialPerPage?: number
  initialIsActive?: boolean | null
   initialOrderBy?: LocationOrderByParam | null
}

export interface LocationsPaginationResponse {
  message: string
  locations: Location[]
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
