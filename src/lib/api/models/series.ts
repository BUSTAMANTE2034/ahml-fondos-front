// ===============================
// MODELOS PRINCIPALES
// ===============================

export interface Series {
  id: number
  user_id: number | null
  catalog_key_id: number | null
  name: string
  acronym: string | null
  start_date: string | null
  end_date: string | null
  is_active: boolean

  user: {
    id: number
    employee_id: string
    first_name: string
    last_name: string
    email: string
  } | null

  catalog_key: {
    id: number
    key: string
    name: string
  } | null

  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface CreateSeries {
  catalog_key_id?: number | null
  name: string
  acronym?: string | null
  start_date?: string | null
  end_date?: string | null
  is_active?: boolean
}

export interface UpdateSeries {
  catalog_key_id?: number | null
  name?: string
  acronym?: string | null
  start_date?: string | null
  end_date?: string | null
  is_active?: boolean
}

export interface SeriesResponse {
  series?: Series
  message: string
}

// ===============================
// PAGINACIÓN
// ===============================

export interface OptionsGetSeries {
  initialPage?: number
  initialPerPage?: number
  initialIsActive?: boolean | null
}

export interface SeriesPaginationResponse {
  message: string
  series: Series[]
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
