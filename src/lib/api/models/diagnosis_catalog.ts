// ==============================
// MODELO PRINCIPAL
// ==============================
export interface DiagnosisCatalog {
  id: number

  concept: string
  detail: string
  description?: string | null

  is_active: boolean

  created_at: string
  updated_at: string
  deleted_at?: string | null
   user?: {
    id: number
    employee_id: string
    first_name: string
    last_name: string
    email: string
  } | null
}


// ==============================
// PAYLOADS
// ==============================
export interface CreateDiagnosisCatalog {
  concept: string
  detail: string
  description?: string | null
  is_active?: boolean
}

export interface UpdateDiagnosisCatalog {
  concept?: string
  detail?: string
  description?: string | null
  is_active?: boolean
}

// ==============================
// RESPONSES
// ==============================
export interface DiagnosisCatalogResponse {
  message: string
  diagnosis_catalog?: DiagnosisCatalog
}

export interface DiagnosisCatalogPaginationResponse {
  message: string
  diagnosis_catalog: DiagnosisCatalog[]
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

// ==============================
// OPCIONES GET (FILTROS)
// ==============================
export interface OptionsGetDiagnosisCatalog {
  initialPage?: number | null
  initialPerPage?: number | null
  initialIsActive?: boolean | null

  initialConcept?: string | null
  initialDetail?: string | null
  initialQuery?: string | null
}
