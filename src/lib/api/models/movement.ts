export type MovementStatus =
  | "archive"
  | "review"
  | "preservation"
  | "restoration"

export interface MovementHistory {
  id: number
  record_file_id: number
  moved_by_user_id: number | null

  origin_status: MovementStatus | null
  destination_status: MovementStatus

  moved_at: string
  description: string | null

  // anidado
  record_file: {
    id: number
    reference_code: string
    availability_status: string
    last_preservation_date: string | null
    last_fund_date: string | null
    deterioration: {
      deterioration_status_id: number
      deterioration_name: string
      deterioration_status_updated_at: string
    } | null
  } | null

  moved_by_user: {
    id: number
    first_name: string
    last_name: string
    email: string
  } | null

  created_at: string
  updated_at: string
  deleted_at?: string | null
}

export interface MovementHistoryResponse {
  movement?: MovementHistory
  message: string
}

export interface CreateMovementHistory {
  record_file_id: number
  destination_status: MovementStatus
  origin_status?: MovementStatus | null
  description?: string
  moved_at?: string
}

export interface UpdateMovementHistory {
  origin_status?: MovementStatus | null
  destination_status?: MovementStatus | null
  description?: string | null
  moved_at?: string | null
}

export interface GetMovementsOptions {
  initialPage?: number
  initialPerPage?: number
  initialRecordFileId?: number | null
  initialUserId?: number | null
  initialOriginStatus?: MovementStatus | null
  initialDestinationStatus?: MovementStatus | null
}

export interface MovementsPaginatedResponse {
  message: string
  movements: MovementHistory[]
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
