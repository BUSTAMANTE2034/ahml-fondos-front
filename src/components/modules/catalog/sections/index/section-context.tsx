import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  Section,
  CreateSection,
  UpdateSection,
} from '@models/section'

import {
  useGetSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
} from '@hooks/catalog/sections'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  sections: Section[]
  pages: number | null
  current_page: number | null

  query: string
  queryInput: string
  setQuery: (q: string) => void

  is_active: boolean | null
  setIsActive: (a: boolean | null) => void

  start_date: string | null
  end_date: string | null
  setStartDate: (d: string | null) => void
  setEndDate: (d: string | null) => void
  totalItems: number

  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  refetch: () => Promise<void>

  selected: Section | null
  setSelected: (u: Section | null) => void

  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateSection) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: Section) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateSection) => Promise<void>

  isEnableOpen: boolean
  openEnable: (u: Section) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: Section) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: Section) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: Section) => void
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

const SectionsContext = createContext<ContextValue | null>(null)

export const useSections = () => {
  const ctx = useContext(SectionsContext)
  if (!ctx) throw new Error('useSections must be inside SectionsProvider')
  return ctx
}

export const SectionsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // ==========================================================
  // GET SectionS (main hook)
  // ==========================================================
  const {
    sections,
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

    start_date,
    end_date,
    setStartDate,
    setEndDate,

    query,
    queryInput,
    setQuery,

    refetch,
  } = useGetSections({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  // ==========================================================
  // CREATE
  // ==========================================================
  const {
    createSection,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateSection()

  // ==========================================================
  // UPDATE
  // ==========================================================
  const {
    updateSection,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateSection()

  // ==========================================================
  // DELETE
  // ==========================================================
  const {
    deleteSection,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteSection()

  // ==========================================================
  // MODALS & SELECTED
  // ==========================================================
  const [selected, setSelected] = useState<Section | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setEnableOpen] = useState(false)
  const [isDisableOpen, setDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  // Helpers
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: Section) => { setSelected(u); setEditOpen(true) }
  const closeEdit = () => { setSelected(null); setEditOpen(false) }

  const openEnable = (u: Section) => { setSelected(u); setEnableOpen(true) }
  const closeEnable = () => { setSelected(null); setEnableOpen(false) }

  const openDisable = (u: Section) => { setSelected(u); setDisableOpen(true) }
  const closeDisable = () => { setSelected(null); setDisableOpen(false) }

  const openDelete = (u: Section) => { setSelected(u); setDeleteOpen(true) }
  const closeDelete = () => { setSelected(null); setDeleteOpen(false) }

  const openShow = (u: Section) => { setSelected(u); setShowOpen(true) }
  const closeShow = () => { setSelected(null); setShowOpen(false) }

  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreate = async (data: CreateSection) => {
    try {
      await createSection(data)

      toastSuccess({
        id: 301,
        title: 'Sección creado',
        message: 'La sección fue creada correctamente.',
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
        message: 'Error inesperado al crear el sección.',
      })
    }
  }

  // ==========================================================
  // UPDATE HANDLER
  // ==========================================================
  const handleUpdate = async (data: UpdateSection) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateSection

    try {
      await updateSection(selected.id, payload)

      toastSuccess({
        id: 303,
        title: 'Sección actualizada',
        message: 'La sección fue actualizada correctamente.',
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
        message: 'Error inesperado al actualizar sección.',
      })
    }
  }

  // ==========================================================
  // ENABLE / DISABLE
  // ==========================================================
  const handleEnable = async (active: boolean) => {
    if (!selected) return

    try {
      await updateSection(selected.id, { is_active: active })

      toastSuccess({
        id: 305,
        title: active ? 'Sección habilitada' : 'Sección deshabilitada',
        message: active
          ? 'La sección está ahora activa.'
          : 'La sección ha sido deshabilitada.',
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
      await deleteSection(selected.id)

      toastSuccess({
        id: 307,
        title: 'Sección eliminado',
        message: 'La sección fue eliminada correctamente.',
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
        message: 'Error inesperado al eliminar sección.',
      })
    }
  }

  return (
    <SectionsContext.Provider
      value={{
        sections,
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
    </SectionsContext.Provider>
  )
}
