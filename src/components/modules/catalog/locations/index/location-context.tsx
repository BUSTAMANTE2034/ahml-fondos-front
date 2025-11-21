import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  Location,
  CreateLocation,
  UpdateLocation,
} from '@models/location'

import {
  useGetLocations,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
} from '@hooks/catalog/locations'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  locations: Location[]
  pages: number | null
  current_page: number | null

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

  selected: Location | null
  setSelected: (u: Location | null) => void

  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateLocation) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: Location) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateLocation) => Promise<void>

  isEnableOpen: boolean
  openEnable: (u: Location) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: Location) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: Location) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: Location) => void
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

const LocationsContext = createContext<ContextValue | null>(null)

export const useLocations = () => {
  const ctx = useContext(LocationsContext)
  if (!ctx) throw new Error('useLocations must be inside LocationsProvider')
  return ctx
}

export const LocationsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // ==========================================================
  // GET LocationS (main hook)
  // ==========================================================
  const {
    locations,
    loading: loadingGet,
    error: errorGet,

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
  } = useGetLocations({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  // ==========================================================
  // CREATE
  // ==========================================================
  const {
    createLocation,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateLocation()

  // ==========================================================
  // UPDATE
  // ==========================================================
  const {
    updateLocation,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateLocation()

  // ==========================================================
  // DELETE
  // ==========================================================
  const {
    deleteLocation,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteLocation()

  // ==========================================================
  // MODALS & SELECTED
  // ==========================================================
  const [selected, setSelected] = useState<Location | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setEnableOpen] = useState(false)
  const [isDisableOpen, setDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  // Helpers
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: Location) => { setSelected(u); setEditOpen(true) }
  const closeEdit = () => { setSelected(null); setEditOpen(false) }

  const openEnable = (u: Location) => { setSelected(u); setEnableOpen(true) }
  const closeEnable = () => { setSelected(null); setEnableOpen(false) }

  const openDisable = (u: Location) => { setSelected(u); setDisableOpen(true) }
  const closeDisable = () => { setSelected(null); setDisableOpen(false) }

  const openDelete = (u: Location) => { setSelected(u); setDeleteOpen(true) }
  const closeDelete = () => { setSelected(null); setDeleteOpen(false) }

  const openShow = (u: Location) => { setSelected(u); setShowOpen(true) }
  const closeShow = () => { setSelected(null); setShowOpen(false) }

  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreate = async (data: CreateLocation) => {
    try {
      await createLocation(data)
      await refetch()

      toastSuccess({
        id: 301,
        title: 'Ubicación creado',
        message: 'La ubicación fue creada correctamente.',
      })

      closeCreate()
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
        message: 'Error inesperado al crear el ubicación.',
      })
    }
  }

  // ==========================================================
  // UPDATE HANDLER
  // ==========================================================
  const handleUpdate = async (data: UpdateLocation) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateLocation

    try {
      await updateLocation(selected.id, payload)
      await refetch()

      toastSuccess({
        id: 303,
        title: 'Ubicación actualizada',
        message: 'La ubicación fue actualizada correctamente.',
      })

      closeEdit()
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
        message: 'Error inesperado al actualizar ubicación.',
      })
    }
  }

  // ==========================================================
  // ENABLE / DISABLE
  // ==========================================================
  const handleEnable = async (active: boolean) => {
    if (!selected) return

    try {
      await updateLocation(selected.id, { is_active: active })
      await refetch()

      toastSuccess({
        id: 305,
        title: active ? 'Ubicación habilitada' : 'Ubicación deshabilitada',
        message: active
          ? 'La ubicación está ahora activa.'
          : 'La ubicación ha sido deshabilitada.',
      })

      setSelected(null)
      setEnableOpen(false)
      setDisableOpen(false)
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
      await deleteLocation(selected.id)
      await refetch()

      toastSuccess({
        id: 307,
        title: 'Ubicación eliminado',
        message: 'La ubicación fue eliminada correctamente.',
      })

      closeDelete()
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
        message: 'Error inesperado al eliminar ubicación.',
      })
    }
  }

  return (
    <LocationsContext.Provider
      value={{
        locations,
        pages,
        current_page,

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
    </LocationsContext.Provider>
  )
}
