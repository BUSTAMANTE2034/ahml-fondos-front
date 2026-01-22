// ==============================
// MODELO PRINCIPAL
// ==============================
export interface RecordDiagnosis {
  id: number

  record_file_id: number
  user_id: number

  revision_date: string
  observations?: string | null

  created_at: string
  updated_at: string
  deleted_at?: string | null

  // relaciones (opcionales según endpoint)
   record_file: {
    id: number
    reference_code: string
    file_date: string
    last_preservation_date: string
    last_fund_date: string
    updated_at: string

    
  } | null
  user?: {
    id: number
    employee_id?: string
    first_name: string
    last_name: string
    email: string
  } | null

  diagnosis_catalog?: DiagnosisCatalog[] | null
}

// ==============================
// RELACIÓN (CATÁLOGO)
// ==============================
export interface DiagnosisCatalog {
  id: number
  concept: string
  detail: string
  description?: string | null
  is_active: boolean
}

// ==============================
// PAYLOADS
// ==============================
export interface CreateRecordDiagnosis {
  record_file_id: number|null
  diagnosis_catalog_ids: number[]
  observations?: string | null
}

export interface UpdateRecordDiagnosis {
  diagnosis_catalog_ids?: number[]
  observations?: string | null
}

// ==============================
// RESPONSES
// ==============================
export interface RecordDiagnosisResponse {
  message: string
  record_diagnosis?: RecordDiagnosis
}

export interface RecordDiagnosisPaginationResponse {
  message: string
  record_diagnoses: RecordDiagnosis[]
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
export interface OptionsGetRecordDiagnosis {
  initialPage?: number | null
  initialPerPage?: number | null

  initialRecordFileId?: number | null
  initialUserId?: number | null

  initialStartDate?: string | null
  initialEndDate?: string | null
}
