import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  PhysicalLocation,
  CreatePhysicalLocation,
  UpdatePhysicalLocation,
} from '@models/physical_location'

import {
  useGetPhysicalLocations,
  useCreatePhysicalLocation,
  useUpdatePhysicalLocation,
  useDeletePhysicalLocation,
} from '@hooks/catalog/physical_locations'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  physicalLocations: PhysicalLocation[]
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

  selected: PhysicalLocation | null
  setSelected: (u: PhysicalLocation | null) => void

  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreatePhysicalLocation) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: PhysicalLocation) => void
  closeEdit: () => void
  handleUpdate: (data: UpdatePhysicalLocation) => Promise<void>

  isEnableOpen: boolean
  openEnable: (u: PhysicalLocation) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: PhysicalLocation) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: PhysicalLocation) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: PhysicalLocation, fromUrl?: boolean) => void
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

const PhysicalLocationsContext = createContext<ContextValue | null>(null)

export const usePhysicalLocations = () => {
  const ctx = useContext(PhysicalLocationsContext)
  if (!ctx)
    throw new Error(
      'usePhysicalLocations must be inside PhysicalLocationsProvider'
    )
  return ctx
}

export const PhysicalLocationsProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  const navigate = useNavigate()
  const location = useLocation()

  // ==========================================================
  // GET PhysicalLocationS (main hook)
  // ==========================================================
  const {
    physicalLocations,
    loading: loadingGet,
    error: errorGet,

    currentPage: current_page,
    totalPages: pages,

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
  } = useGetPhysicalLocations({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  // ==========================================================
  // CREATE
  // ==========================================================
  const {
    createPhysicalLocation,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreatePhysicalLocation()

  // ==========================================================
  // UPDATE
  // ==========================================================
  const {
    updatePhysicalLocation,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdatePhysicalLocation()

  // ==========================================================
  // DELETE
  // ==========================================================
  const {
    deletePhysicalLocation,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeletePhysicalLocation()

  // ==========================================================
  // MODALS & SELECTED
  // ==========================================================
  const [selected, setSelected] = useState<PhysicalLocation | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setEnableOpen] = useState(false)
  const [isDisableOpen, setDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  // Helpers
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: PhysicalLocation) => {
    setSelected(u)
    setEditOpen(true)
  }
  const closeEdit = () => {
    setSelected(null)
    setEditOpen(false)
  }

  const openEnable = (u: PhysicalLocation) => {
    setSelected(u)
    setEnableOpen(true)
  }
  const closeEnable = () => {
    setSelected(null)
    setEnableOpen(false)
  }

  const openDisable = (u: PhysicalLocation) => {
    setSelected(u)
    setDisableOpen(true)
  }
  const closeDisable = () => {
    setSelected(null)
    setDisableOpen(false)
  }

  const openDelete = (u: PhysicalLocation) => {
    setSelected(u)
    setDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelected(null)
    setDeleteOpen(false)
  }

  const openShow = (u: PhysicalLocation, fromUrl = false) => {
    setSelected(u)
    setShowOpen(true)

    const target = `/admin/1/physical_locations/${u.code}`

    if (!fromUrl && location.pathname !== target) {
      navigate(target, { replace: true })
    }
  }
  const closeShow = () => {
  setSelected(null)
  setShowOpen(false)

  navigate('/admin/1/physical_locations', {
    replace: true,
  })
}
  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreate = async (data: CreatePhysicalLocation) => {
    try {
      await createPhysicalLocation(data)

      toastSuccess({
        id: 301,
        title: 'Localidad creado',
        message: 'El lugar fue creada correctamente.',
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
        message: 'Error inesperado al crear el ubicación.',
      })
    }
  }

  // ==========================================================
  // UPDATE HANDLER
  // ==========================================================
  const handleUpdate = async (data: UpdatePhysicalLocation) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdatePhysicalLocation

    try {
      await updatePhysicalLocation(selected.id, payload)

      toastSuccess({
        id: 303,
        title: 'Localidad actualizada',
        message: 'El lugar fue actualizada correctamente.',
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
      await updatePhysicalLocation(selected.id, { is_active: active })

      toastSuccess({
        id: 305,
        title: active ? 'Localidad habilitada' : 'Localidad deshabilitada',
        message: active
          ? 'El lugar está ahora activa.'
          : 'El lugar ha sido deshabilitada.',
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
      await deletePhysicalLocation(selected.id)

      toastSuccess({
        id: 307,
        title: 'Localidad eliminado',
        message: 'El lugar fue eliminada correctamente.',
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
        message: 'Error inesperado al eliminar ubicación.',
      })
    }
  }

  return (
    <PhysicalLocationsContext.Provider
      value={{
        physicalLocations,
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
    </PhysicalLocationsContext.Provider>
  )
}
