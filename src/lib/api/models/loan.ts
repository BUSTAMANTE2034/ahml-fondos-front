import { RecordFileAvailability } from "./record-file"
export interface LoanRecordFile {
  id: number
  reference_code: string
  availability_status: "available"
  | "on_loan"
  | "under_review"
  | "unavailable"
  file_number: string
}

export interface LoanUser {
  id: number
  first_name: string
  last_name: string
  email: string
}

export interface Loan {
  id: number
  record_file_id: number
  description: string | null

  loaded_at: string | null
  returned_at: string | null

  issued_by_user_id: number | null
  loaded_by_user_id: number | null

  record_file: LoanRecordFile | null
  issued_by_user: LoanUser | null
  loaded_by_user: LoanUser | null

  // NUEVO estado calculado
  is_active: boolean

  // timestamps de marshmallow, pueden venir null
  created_at: string | null
  updated_at: string | null
  deleted_at: string | null
}

export interface LoanResponse {
  message: string
  loan?: Loan
}

export interface CreateLoan {
  record_file_id?: number
  description?: string | null
}

export interface UpdateLoan {
  description?: string | null
}

export interface ReceiveLoan {
  // no envías nada, solo PUT /loans/:id/receive
}

export interface GetLoansOptions {
  initialPage?: number
  initialPerPage?: number
  initialQuery?: string
  initialActive?: boolean | null
}

export interface LoansPaginatedResponse {
  message: string
  loans: Loan[]
  pagination: {
    total: number
    pages: number
    current_page: number
    per_page: number
    // puedes agregar estos si los quieres también
    has_next?: boolean
    has_prev?: boolean
    next_page?: number | null
    prev_page?: number | null
  }
}
