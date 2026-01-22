import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  Series,
  CreateSeries,
  UpdateSeries,
  SeriesOrderByParam,
} from '@models/series'

import {
  useGetSeries,
  useCreateSeries,
  useUpdateSeries,
  useDeleteSeries,
} from '@hooks/catalog/series'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  series: Series[]
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

  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  refetch: () => Promise<void>

// order
  order_by: SeriesOrderByParam| null
  setOrderBy: (v: SeriesOrderByParam | null) => void
  selected: Series | null
  setSelected: (u: Series | null) => void

  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateSeries) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: Series) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateSeries) => Promise<void>

  isEnableOpen: boolean
  openEnable: (u: Series) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: Series) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: Series) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: Series) => void
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

const SeriessContext = createContext<ContextValue | null>(null)

export const useSeries = () => {
  const ctx = useContext(SeriessContext)
  if (!ctx) throw new Error('useSeriess must be inside SeriessProvider')
  return ctx
}

export const SeriesProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // ==========================================================
  // GET SeriesS (main hook)
  // ==========================================================
  const {
    series,
    loading: loadingGet,
    error: errorGet,

    currentPage:current_page,
    totalPages:pages,
order_by,setOrderBy,
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
  } = useGetSeries({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  // ==========================================================
  // CREATE
  // ==========================================================
  const {
    createSeries,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateSeries()

  // ==========================================================
  // UPDATE
  // ==========================================================
  const {
    updateSeries,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateSeries()

  // ==========================================================
  // DELETE
  // ==========================================================
  const {
    deleteSeries,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteSeries()

  // ==========================================================
  // MODALS & SELECTED
  // ==========================================================
  const [selected, setSelected] = useState<Series | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setEnableOpen] = useState(false)
  const [isDisableOpen, setDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  // Helpers
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: Series) => { setSelected(u); setEditOpen(true) }
  const closeEdit = () => { setSelected(null); setEditOpen(false) }

  const openEnable = (u: Series) => { setSelected(u); setEnableOpen(true) }
  const closeEnable = () => { setSelected(null); setEnableOpen(false) }

  const openDisable = (u: Series) => { setSelected(u); setDisableOpen(true) }
  const closeDisable = () => { setSelected(null); setDisableOpen(false) }

  const openDelete = (u: Series) => { setSelected(u); setDeleteOpen(true) }
  const closeDelete = () => { setSelected(null); setDeleteOpen(false) }

  const openShow = (u: Series) => { setSelected(u); setShowOpen(true) }
  const closeShow = () => { setSelected(null); setShowOpen(false) }

  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreate = async (data: CreateSeries) => {
    try {
      await createSeries(data)
      

      toastSuccess({
        id: 301,
        title: 'Seriee creado',
        message: 'La serie fue creada correctamente.',
      })

      await refetch()
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
        message: 'Error inesperado al crear el serie.',
      })
    }
  }

  // ==========================================================
  // UPDATE HANDLER
  // ==========================================================
  const handleUpdate = async (data: UpdateSeries) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateSeries

    try {
      await updateSeries(selected.id, payload)

      toastSuccess({
        id: 303,
        title: 'Serie actualizada',
        message: 'La serie fue actualizada correctamente.',
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
        message: 'Error inesperado al actualizar serie.',
      })
    }
  }

  // ==========================================================
  // ENABLE / DISABLE
  // ==========================================================
  const handleEnable = async (active: boolean) => {
    if (!selected) return

    try {
      await updateSeries(selected.id, { is_active: active })
    

      toastSuccess({
        id: 305,
        title: active ? 'Serie habilitada' : 'Serie deshabilitada',
        message: active
          ? 'La serie está ahora activa.'
          : 'La serie ha sido deshabilitada.',
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
      await deleteSeries(selected.id)
      

      toastSuccess({
        id: 307,
        title: 'Serie eliminado',
        message: 'La serie fue eliminada correctamente.',
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
        message: 'Error inesperado al eliminar serie.',
      })
    }
  }

  return (
    <SeriessContext.Provider
      value={{
        series,
        pages,
        current_page,

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
         // orden
        order_by,
        setOrderBy,
      }}
    >
      {children}
    </SeriessContext.Provider>
  )
}
