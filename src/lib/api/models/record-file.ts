// =========================
//        TYPOLOGIES
// =========================
export interface Typology {
  id: number
  name: string
  description: string | null

  user?: {
    id: number
    first_name: string
    last_name: string
    email: string
  } | null
}
export interface PhysicalLocation {
  id: number
  code: string
  description: string | null
}

// =========================
//      DETERIORATION
// =========================
export interface DeteriorationStatus {
  id: number
  name: string
  description: string | null
  updated_at: string | null
}

// =========================
//       RECORD FILE
// =========================
export interface AuditUser {
  id: number
  first_name: string
  last_name: string
  email: string
}

export type RecordFileAvailability =
  | 'available'
  | 'on_loan'
  | 'under_review'
  | 'unavailable'

export interface RecordFile {
  id: number
  reference_code: string
  previous_reference_code: string | null

  subject: string
  file_number: string | null // backend expects string for ILIKE
  box: {
    id: number
    box_number: string | null
    description: string | null
    physical_location: PhysicalLocation | null
  } // backend expects string for ILIKE
  sensitive_data: boolean
  comments: string | null
  availability_status: RecordFileAvailability

  page_count: number | null
  document_sizes?: string | null
  file_date: string | null
  last_preservation_date: string | null
  last_fund_date: string | null
  box_id: number | null
  fund_id: number | null
  section_id: number | null
  series_id: number | null
  location_id: number | null
  deterioration_status_id: number | null

  created_at: string
  updated_at: string
  deleted_at?: string | null

  // relaciones
  // relaciones de auditoría
  user?: AuditUser | null // creador
  updated_user?: AuditUser | null // último editor
  deleted_user?: AuditUser | null // quien eliminó

  fund: {
    id: number
    name: string
    acronym: string
    start_date: string
    end_date: string
  } | null

  section: {
    id: number
    name: string
    acronym: string
    start_date: string
    end_date: string
  } | null

  series: {
    id: number
    name: string
    acronym: string
    start_date: string
    end_date: string
  } | null

  location?: {
    id: number
    name: string
  } | null

  deterioration_status?: DeteriorationStatus | null

  typologies?: Typology[]
}

// =========================
//        CREATE / UPDATE
// =========================
export interface CreateRecordFile {
  subject: string
  previous_reference_code?: string | null
  file_number?: string | null
  box_id?: number | null
  comments?: string | null
  sensitive_data?: boolean
  availability_status?: RecordFileAvailability

  fund_id?: number | null
  section_id?: number | null
  series_id?: number | null
  location_id?: number | null

  page_count?: number | null
  file_date?: string | null
  last_preservation_date?: string | null
  last_fund_date?: string | null

  deterioration_status_id?: number | null
  typology_ids?: number[]
  document_sizes?: string | null
}

export interface UpdateRecordFile extends Partial<CreateRecordFile> {}

// =========================
//        RESPONSES
// =========================
export interface RecordFilePaginatedResponse {
  message: string
  record_files: RecordFile[]
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

export interface RecordFileResponse {
  message: string
  record_file: RecordFile
}

// =========================
//      ORDER BY (BACKEND)
// =========================
export type RecordFileOrderByParam =
  | 'created_at_asc'
  | 'created_at_desc'
  | 'updated_at_asc'
  | 'updated_at_desc'
  | 'file_date_asc'
  | 'file_date_desc'
  | 'deterioration_status_updated_at_asc'
  | 'deterioration_status_updated_at_desc'
  | 'box_number_asc'
  | 'box_number_desc'
  | 'file_number_asc'
  | 'file_number_desc'
  | 'fund_name_asc'
  | 'fund_name_desc'
  | 'section_name_asc'
  | 'section_name_desc'
  | 'series_name_asc'
  | 'series_name_desc'
  | 'location_name_asc'
  | 'location_name_desc'

export type RecordFileOrderBy =
  | RecordFileOrderByParam
  | `${RecordFileOrderByParam},${RecordFileOrderByParam}`

// =========================
//      GET OPTIONS
// =========================
export interface GetRecordFilesOptions {
  initialPage?: number
  initialPerPage?: number

  // búsqueda global
  initialQuery?: string

  // filtros directos
  initialReferenceCode?: string
  initialPreviousReferenceCode?: string
  initialFileNumber?: string
  initialBoxNumber?: string

  // confidencialidad
  initialSensitive?: 'all' | 'delicate' | 'not_delicate'

  // filtros por nombre
  initialFundName?: string
  initialUserQuery?: string
  initialSectionName?: string
  initialSeriesName?: string
  initialLocationName?: string
  initialDeteriorationName?: string
  initialTypologyName?: string

  // disponibilidad
  initialAvailabilityStatus?: RecordFileAvailability | 'all'

  // fechas documentales
  initialFileDateAfter?: string | null
  initialFileDateBefore?: string | null

  // ordenamiento
  initialOrderBy?: RecordFileOrderByParam | null
}
