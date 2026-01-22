export interface Catalog_Key {
  id: number
  user_id: string
  name: string
  description: string
  key: string
  entity_type: 'fund' | 'section' | 'series'
  is_active: boolean
  user: User
  created_at: string
  updated_at: string
  deleted_at?: string | null
}
export interface User {
  first_name: string
  last_name: string
  email: string
  employee_id:string
}

export interface CreateCatalog_Key {
  key: string
  name: string
  description: string
  entity_type: 'fund' | 'section' | 'series'
}
export interface UpdateCatalog_Key {
  key?: string
  name?: string
  description?: string
  entity_type?: 'fund' | 'section' | 'series'
  is_active?: boolean
}
export interface Catalog_KeyResponse {
  catalog_Key?: Catalog_Key
  message: string
}
export type CatalogKeyOrderByParam =
  | "created_at_asc"
  | "created_at_desc"
  | "updated_at_asc"
  | "updated_at_desc"
  | "name_asc"
  | "name_desc"
  | "key_asc"
  | "key_desc"


export interface OptionsGetCatalog_Key {
  initialPage?: number | null
  initialPerPage?: number | null
  initialIsActive?: boolean | null
  initialOrderBy?: CatalogKeyOrderByParam | null

}
export interface Catalog_KeysPaginationResponse {
  message: string
  catalog_keys: Catalog_Key[]
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
