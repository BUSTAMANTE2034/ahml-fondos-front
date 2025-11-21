export interface Fund {
  id: number
  catalog_key_id: number

  name: string
  acronym: string | null
  user_id: string
  start_date: string | null
  end_date: string | null

  is_active: boolean

  created_at: string
  updated_at: string
  deleted_at?: string | null

  // relaciones
  user?: {
    id: number
    employee_id:string
    first_name: string
    last_name: string
    email: string
  } | null

  catalog_key?: {
    id: number
    key: string
    name: string
  } | null
}

export interface CreateFund {
  catalog_key_id?: number | null
  name: string
  acronym?: string | null
  start_date?: string | null
  end_date?: string | null
  is_active?: boolean
}

export interface UpdateFund {
  catalog_key_id?: number | null
  name?: string
  acronym?: string | null
  start_date?: string | null
  end_date?: string | null
  is_active?: boolean
}

export interface FundResponse {
  fund?: Fund
  message: string
}

export interface FundPaginationResponse {
  message: string
  funds: Fund[]
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

export interface OptionsGetFunds {
  initialPage?: number | null
  initialPerPage?: number | null
  initialIsActive?: boolean | null
}
