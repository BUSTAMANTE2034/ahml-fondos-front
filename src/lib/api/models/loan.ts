export interface LoanRecordFile {
  id: number
  reference_code: string
  availability_status: string
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

  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface LoanResponse {
  message: string
  loan?: Loan
}

export interface CreateLoan {
  record_file_id: number
  description?: string | null
}

export interface UpdateLoan {
  description?: string | null
}

export interface ReceiveLoan {
  // no envías nada, solo endpoint POST/PUT
}

export interface GetLoansOptions {
  initialPage?: number
  initialPerPage?: number
  initialQuery?: string
  initialLoadedAfter?: string | null
  initialLoadedBefore?: string | null
  initialReturnedAfter?: string | null
  initialReturnedBefore?: string | null
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
  }
}
