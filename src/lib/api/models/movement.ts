// ======================================
// Tipos de estado permitidos PARA MOVIMIENTOS
// (los del record_file, sin on_loan)
// ======================================
export type MovementStatus =
  | "available"
  | "under_review"
  | "unavailable"

// ======================================
// Modelo completo de un movimiento
// ======================================
export interface MovementHistory {
  id: number
  record_file_id: number
  moved_by_user_id: number | null

  origin_status: MovementStatus | null
  destination_status: MovementStatus

  moved_at: string
  description: string | null

  // ---- Expediente ligado ----
  record_file: {
    id: number
    reference_code: string
    availability_status: MovementStatus | "on_loan"  // por si viene desde Loans
    last_preservation_date: string | null
    last_fund_date: string | null
    deterioration: {
      deterioration_status_id: number
      deterioration_name: string
      deterioration_status_updated_at: string
    } | null
  } | null

  // ---- Usuario que movió ----
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

// ======================================
// Respuesta individual
// ======================================
export interface MovementHistoryResponse {
  movement?: MovementHistory
  message: string
}

// ======================================
// Crear movimiento
// ======================================
export interface CreateMovementHistory {
  record_file_id: number
  destination_status: MovementStatus
  description: string
}

// ======================================
// Actualizar movimiento
// ======================================
export interface UpdateMovementHistory {
  origin_status?: MovementStatus | null
  destination_status?: MovementStatus | null
  description?: string | null
  moved_at?: string | null
}

// ======================================
// Opciones para GET paginado
// ======================================
export interface GetMovementsOptions {
  initialPage?: number
  initialPerPage?: number
}

// ======================================
// Respuesta paginada
// ======================================
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
