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
export type RecordFileAvailability =
  | "available"
  | "on_loan"
  | "under_review"
  | "unavailable"

export interface RecordFile {
  id: number
  reference_code: string

  subject: string
  file_number: number | null
  box_number: number | null
  sensitive_data: boolean
  comments: string | null
  availability_status: RecordFileAvailability

  page_count: number | null
  file_date: string | null
  last_preservation_date: string | null
  last_fund_date: string | null

  fund_id: number | null
  section_id: number | null
  series_id: number | null
  location_id: number | null
  deterioration_status_id: number | null

  // relaciones
  user?: {
    id: number
    first_name: string
    last_name: string
    email: string
  } | null

  fund: {
    id: number
    name: string
    acronym: string
    start_date: string
    end_date: String
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
    created_at: string
  updated_at: string
  deleted_at?: string | null
}

// =========================
//        CREATE / UPDATE
// =========================
export interface CreateRecordFile {
  subject: string
  file_number?: number | null
  box_number?: number | null
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
//      ORDER BY / FILTERS
// =========================
export type RecordFileOrderBy =
  | "id"
  | "reference_code"
  | "file_number"
  | "subject"
  | "box_number"
  | "created_at"
  | "updated_at"
  | "file_date"
  | "last_fund_date"
  | "last_preservation_date"

export type RecordFileOrderDirection = "asc" | "desc"

// =========================
//      HOOK OPTIONS
// =========================
export interface GetRecordFilesOptions {
  initialPage?: number
  initialPerPage?: number

  initialQuery?: string

  initialFundId?: number | null
  initialSectionId?: number | null
  initialSeriesId?: number | null
  initialLocationId?: number | null
  initialDeteriorationStatusId?: number | null
  initialAvailabilityStatus?: RecordFileAvailability | null

  initialCreatedAfter?: string | null
  initialCreatedBefore?: string | null
  initialFileDateAfter?: string | null
  initialFileDateBefore?: string | null

  initialTypologyIds?: number[]

  initialOrderBy?: RecordFileOrderBy | null
  initialOrderDirection?: RecordFileOrderDirection
}
