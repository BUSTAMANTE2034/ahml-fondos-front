import { useCallback, useEffect, useState } from 'react'
import {
  OptionsGetUser,
  User,
  UsersPaginationResponse,
} from '../../models/user'
import { ApiError } from '@/lib/types/errors'
import { apiFetch } from '@/lib/types/client'

export const useGetUsers = ({
  initialPage = 1,
  initialIsActive = null,
  initialRole = 'manager',
  initialPerPage = 20,
}: OptionsGetUser = {}) => {
  //Datos y estados
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  //Filtros
  const [current_page, setCurrentPage] = useState<number | null>(initialPage)
  const [per_page, setPer_page] = useState<number | null>(initialPerPage)
  const [role, setRole] = useState<string | null>(initialRole)
  const [is_active, setIsActive] = useState<boolean | null>(initialIsActive)
  const [total, setTotal] = useState<number>(0)
  //Query
  const [queryInput, setQueryInput] = useState('')
  const [query, setQuery] = useState('')
  useEffect(() => {
    const id = setTimeout(() => {
      setQuery(queryInput)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(id)
  }, [queryInput])
  //Paginación
  const [pages, setPages] = useState<number | null>(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [nextPage, setNextPage] = useState<number | null>(null)
  const [prevPage, setPrevPage] = useState<number | null>(null)

  //Función
  const getUsers = useCallback(async () => {
    setError(null)
    setLoading(true)

    const params = new URLSearchParams()
    if (current_page !== null) params.append('page', String(current_page))
    if (per_page !== null) params.append('per_page', String(per_page))
    if (is_active !== null) params.append('is_active', String(is_active))
    if (role) params.append('role', role)
    if (query) params.append('query', query)

    const url = `/users${params.toString() ? `?${params}` : ''}`

    try {
      const data = await apiFetch<UsersPaginationResponse>(url, {
        method: 'GET',
      })
      const users = Array.isArray(data.users) ? data.users : []
      const pagination = data.pagination
      //Seteo de datos
      setUsers(users)
      setTotal(pagination.total)
      setPages(pagination.pages)
      setPer_page(pagination.per_page)
      setCurrentPage(pagination.current_page)
      setPrevPage(pagination.prev_page)
      setNextPage(pagination.next_page)
      setHasNext(pagination.has_next)
      setHasPrev(pagination.has_prev)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al obtener usuarios.')
      } else {
        setError('Error desconocido.')
      }
    } finally {
      setLoading(false)
    }
  }, [current_page, per_page, role, query, is_active])

  //Auto Solicitud
  useEffect(() => {
    getUsers()
  }, [getUsers])

  //Navegación
  const goNext = useCallback(() => {
    if (nextPage !== null) setCurrentPage(nextPage)
  }, [nextPage])

  const goPrev = useCallback(() => {
    if (prevPage !== null) setCurrentPage(prevPage)
  }, [prevPage])

  return {
    users,
    loading,
    error,

    //Paginación
    current_page,
    total,
    pages,
    hasNext,
    hasPrev,
    prevPage,
    nextPage,

    //Filtros
    role,
    setRole: (r: string) => {
      setRole(r)
      setCurrentPage(1)
    },
    is_active,
    setIsActive: (v: boolean | null) => {
      setIsActive(v)
      setCurrentPage(1)
    },

    //Búsqueda
    query,
    queryInput,
    setQuery: setQueryInput,

    //Navegación
    goNext,
    goPrev,

    //refetch
    getUsers,
  }
}
