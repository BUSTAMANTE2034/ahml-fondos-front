import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  Deterioration,
  CreateDeterioration,
  UpdateDeterioration,
} from '@models/deterioration'

import {
  useGetDeteriorations,
  useCreateDeterioration,
  useUpdateDeterioration,
  useDeleteDeterioration,
} from '@hooks/catalog/deteriorations'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  deteriorations: Deterioration[]
  pages: number | null
  current_page: number | null
  totalItems: number

  query: string
  queryInput: string
  setQuery: (q: string) => void

  is_active: boolean | null
  setIsActive: (a: boolean | null) => void


  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  refetch: () => Promise<void>

  selected: Deterioration | null
  setSelected: (u: Deterioration | null) => void

  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateDeterioration) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: Deterioration) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateDeterioration) => Promise<void>

  isEnableOpen: boolean
  openEnable: (u: Deterioration) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: Deterioration) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: Deterioration) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: Deterioration) => void
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

const DeteriorationsContext = createContext<ContextValue | null>(null)

export const useDeteriorations = () => {
  const ctx = useContext(DeteriorationsContext)
  if (!ctx) throw new Error('useDeteriorations must be inside DeteriorationsProvider')
  return ctx
}

export const DeteriorationsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // ==========================================================
  // GET DeteriorationS (main hook)
  // ==========================================================
  const {
    deteriorations,
    loading: loadingGet,
    error: errorGet,
    totalItems,

    currentPage:current_page,
    totalPages:pages,

    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goNext,
    goPrev,

    // filters
    is_active,
    setIsActive,

  

    query,
    queryInput,
    setQuery,

    refetch,
  } = useGetDeteriorations({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  // ==========================================================
  // CREATE
  // ==========================================================
  const {
    createDeterioration,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateDeterioration()

  // ==========================================================
  // UPDATE
  // ==========================================================
  const {
    updateDeterioration,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateDeterioration()

  // ==========================================================
  // DELETE
  // ==========================================================
  const {
    deleteDeterioration,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteDeterioration()

  // ==========================================================
  // MODALS & SELECTED
  // ==========================================================
  const [selected, setSelected] = useState<Deterioration | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setEnableOpen] = useState(false)
  const [isDisableOpen, setDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  // Helpers
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: Deterioration) => { setSelected(u); setEditOpen(true) }
  const closeEdit = () => { setSelected(null); setEditOpen(false) }

  const openEnable = (u: Deterioration) => { setSelected(u); setEnableOpen(true) }
  const closeEnable = () => { setSelected(null); setEnableOpen(false) }

  const openDisable = (u: Deterioration) => { setSelected(u); setDisableOpen(true) }
  const closeDisable = () => { setSelected(null); setDisableOpen(false) }

  const openDelete = (u: Deterioration) => { setSelected(u); setDeleteOpen(true) }
  const closeDelete = () => { setSelected(null); setDeleteOpen(false) }

  const openShow = (u: Deterioration) => { setSelected(u); setShowOpen(true) }
  const closeShow = () => { setSelected(null); setShowOpen(false) }

  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreate = async (data: CreateDeterioration) => {
    try {
      await createDeterioration(data)

      toastSuccess({
        id: 301,
        title: 'Tipología creado',
        message: 'La tipología fue creada correctamente.',
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
        message: 'Error inesperado al crear el tipología.',
      })
    }
  }

  // ==========================================================
  // UPDATE HANDLER
  // ==========================================================
  const handleUpdate = async (data: UpdateDeterioration) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateDeterioration

    try {
      await updateDeterioration(selected.id, payload)

      toastSuccess({
        id: 303,
        title: 'Tipología actualizada',
        message: 'La tipología fue actualizada correctamente.',
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
        message: 'Error inesperado al actualizar tipología.',
      })
    }
  }

  // ==========================================================
  // ENABLE / DISABLE
  // ==========================================================
  const handleEnable = async (active: boolean) => {
    if (!selected) return

    try {
      await updateDeterioration(selected.id, { is_active: active })

      toastSuccess({
        id: 305,
        title: active ? 'Tipología habilitada' : 'Tipología deshabilitada',
        message: active
          ? 'La tipología está ahora activa.'
          : 'La tipología ha sido deshabilitada.',
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
      await deleteDeterioration(selected.id)

      toastSuccess({
        id: 307,
        title: 'Tipología eliminado',
        message: 'La tipología fue eliminada correctamente.',
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
        message: 'Error inesperado al eliminar tipología.',
      })
    }
  }

  return (
    <DeteriorationsContext.Provider
      value={{
        deteriorations,
        pages,
        current_page,
        totalItems,

        query,
        queryInput,
        setQuery,

        is_active,
        setIsActive,

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
    </DeteriorationsContext.Provider>
  )
}
