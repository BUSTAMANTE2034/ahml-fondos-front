import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  Typology,
  CreateTypology,
  UpdateTypology,
} from '@models/typology'

import {
  useGetTypologies,
  useCreateTypology,
  useUpdateTypology,
  useDeleteTypology,
} from '@hooks/catalog/typologies'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  typologies: Typology[]
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

  selected: Typology | null
  setSelected: (u: Typology | null) => void

  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateTypology) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: Typology) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateTypology) => Promise<void>

  isEnableOpen: boolean
  openEnable: (u: Typology) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: Typology) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: Typology) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: Typology) => void
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

const TypologiesContext = createContext<ContextValue | null>(null)

export const useTypologies = () => {
  const ctx = useContext(TypologiesContext)
  if (!ctx) throw new Error('useTypologies must be inside TypologiesProvider')
  return ctx
}

export const TypologiesProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // ==========================================================
  // GET TypologyS (main hook)
  // ==========================================================
  const {
    typologies,
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
  } = useGetTypologies({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  // ==========================================================
  // CREATE
  // ==========================================================
  const {
    createTypology,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateTypology()

  // ==========================================================
  // UPDATE
  // ==========================================================
  const {
    updateTypology,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateTypology()

  // ==========================================================
  // DELETE
  // ==========================================================
  const {
    deleteTypology,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteTypology()

  // ==========================================================
  // MODALS & SELECTED
  // ==========================================================
  const [selected, setSelected] = useState<Typology | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setEnableOpen] = useState(false)
  const [isDisableOpen, setDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  // Helpers
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: Typology) => { setSelected(u); setEditOpen(true) }
  const closeEdit = () => { setSelected(null); setEditOpen(false) }

  const openEnable = (u: Typology) => { setSelected(u); setEnableOpen(true) }
  const closeEnable = () => { setSelected(null); setEnableOpen(false) }

  const openDisable = (u: Typology) => { setSelected(u); setDisableOpen(true) }
  const closeDisable = () => { setSelected(null); setDisableOpen(false) }

  const openDelete = (u: Typology) => { setSelected(u); setDeleteOpen(true) }
  const closeDelete = () => { setSelected(null); setDeleteOpen(false) }

  const openShow = (u: Typology) => { setSelected(u); setShowOpen(true) }
  const closeShow = () => { setSelected(null); setShowOpen(false) }

  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreate = async (data: CreateTypology) => {
    try {
      await createTypology(data)

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
  const handleUpdate = async (data: UpdateTypology) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateTypology

    try {
      await updateTypology(selected.id, payload)

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
      await updateTypology(selected.id, { is_active: active })

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
      await deleteTypology(selected.id)

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
    <TypologiesContext.Provider
      value={{
        typologies,
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
    </TypologiesContext.Provider>
  )
}
