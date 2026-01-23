import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  Fund,
  CreateFund,
  UpdateFund,
} from '@models/fund'

import {
  useGetFunds,
  useCreateFund,
  useUpdateFund,
  useDeleteFund,
} from '@hooks/catalog/funds'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  funds: Fund[]
  pages: number | null
  current_page: number | null

  query: string
  queryInput: string
  setQuery: (q: string) => void
  totalItems: number

  is_active: boolean | null
  setIsActive: (a: boolean | null) => void

  start_date: string | null
  end_date: string | null
  setStartDate: (d: string | null) => void
  setEndDate: (d: string | null) => void

  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  refetch: () => Promise<void>

  selected: Fund | null
  setSelected: (u: Fund | null) => void

  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateFund) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: Fund) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateFund) => Promise<void>

  isEnableOpen: boolean
  openEnable: (u: Fund) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: Fund) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: Fund) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: Fund) => void
  closeShow: () => void

  loadingGet: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean

  errorGet: string | null
  errorCreate: string | null
  errorUpdate: string | null
  errorDelete: string | null
}

const FundsContext = createContext<ContextValue | null>(null)

export const useFunds = () => {
  const ctx = useContext(FundsContext)
  if (!ctx) throw new Error('useFunds must be inside FundsProvider')
  return ctx
}

export const FundsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // ==========================================================
  // GET FUNDS (main hook)
  // ==========================================================
  const {
    funds,
    loading: loadingGet,
    error: errorGet,

    currentPage:current_page,
    totalPages:pages,
totalItems,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goNext,
    goPrev,

    // filters
    is_active,
    setIsActive,

    start_date,
    end_date,
    setStartDate,
    setEndDate,

    query,
    queryInput,
    setQuery,

    refetch,
  } = useGetFunds({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  // ==========================================================
  // CREATE
  // ==========================================================
  const {
    createFund,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateFund()

  // ==========================================================
  // UPDATE
  // ==========================================================
  const {
    updateFund,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateFund()

  // ==========================================================
  // DELETE
  // ==========================================================
  const {
    deleteFund,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteFund()

  // ==========================================================
  // MODALS & SELECTED
  // ==========================================================
  const [selected, setSelected] = useState<Fund | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setEnableOpen] = useState(false)
  const [isDisableOpen, setDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  // Helpers
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: Fund) => { setSelected(u); setEditOpen(true) }
  const closeEdit = () => { setSelected(null); setEditOpen(false) }

  const openEnable = (u: Fund) => { setSelected(u); setEnableOpen(true) }
  const closeEnable = () => { setSelected(null); setEnableOpen(false) }

  const openDisable = (u: Fund) => { setSelected(u); setDisableOpen(true) }
  const closeDisable = () => { setSelected(null); setDisableOpen(false) }

  const openDelete = (u: Fund) => { setSelected(u); setDeleteOpen(true) }
  const closeDelete = () => { setSelected(null); setDeleteOpen(false) }

  const openShow = (u: Fund) => { setSelected(u); setShowOpen(true) }
  const closeShow = () => { setSelected(null); setShowOpen(false) }

  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreate = async (data: CreateFund) => {
    try {
      await createFund(data)

      toastSuccess({
        id: 301,
        title: 'Fondo creado',
        message: 'El fondo fue creado correctamente.',
      })

      closeCreate()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 302, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 302,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 302,
        title: 'Error',
        message: 'Error inesperado al crear el fondo.',
      })
    }
  }

  // ==========================================================
  // UPDATE HANDLER
  // ==========================================================
  const handleUpdate = async (data: UpdateFund) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateFund

    try {
      await updateFund(selected.id, payload)

      toastSuccess({
        id: 303,
        title: 'Fondo actualizado',
        message: 'El fondo fue actualizado correctamente.',
      })

      closeEdit()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 304, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 304,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 304,
        title: 'Error',
        message: 'Error inesperado al actualizar fondo.',
      })
    }
  }

  // ==========================================================
  // ENABLE / DISABLE
  // ==========================================================
  const handleEnable = async (active: boolean) => {
    if (!selected) return

    try {
      await updateFund(selected.id, { is_active: active })

      toastSuccess({
        id: 305,
        title: active ? 'Fondo habilitado' : 'Fondo deshabilitado',
        message: active
          ? 'El fondo está ahora activo.'
          : 'El fondo ha sido deshabilitado.',
      })

      setSelected(null)
      setEnableOpen(false)
      setDisableOpen(false)
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)

      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 306, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 306,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 306,
        title: 'Error',
        message: 'Error inesperado al actualizar estatus.',
      })
    }
  }

  // ==========================================================
  // DELETE HANDLER
  // ==========================================================
  const handleDelete = async () => {
    if (!selected) return

    try {
      await deleteFund(selected.id)

      toastSuccess({
        id: 307,
        title: 'Fondo eliminado',
        message: 'El fondo fue eliminado correctamente.',
      })

      closeDelete()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)

      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 308, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 308,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 308,
        title: 'Error',
        message: 'Error inesperado al eliminar fondo.',
      })
    }
  }

  return (
    <FundsContext.Provider
      value={{
        funds,
        pages,
        current_page,

        totalItems,
        query,
        queryInput,
        setQuery,

        is_active,
        setIsActive,

        start_date,
        end_date,
        setStartDate,
        setEndDate,

        hasNext,
        hasPrev,
        nextPage,
        prevPage,
        goNext,
        goPrev,

        refetch,

        selected,
        setSelected,

        isCreateOpen,
        openCreate,
        closeCreate,
        handleCreate,

        isEditOpen,
        openEdit,
        closeEdit,
        handleUpdate,

        isEnableOpen,
        openEnable,
        closeEnable,
        isDisableOpen,
        openDisable,
        closeDisable,
        handleEnable,

        isDeleteOpen,
        openDelete,
        closeDelete,
        handleDelete,

        isShowOpen,
        openShow,
        closeShow,

        loadingGet,
        loadingCreate,
        loadingUpdate,
        loadingDelete,

        errorGet,
        errorCreate,
        errorUpdate,
        errorDelete,
      }}
    >
      {children}
    </FundsContext.Provider>
  )
}
