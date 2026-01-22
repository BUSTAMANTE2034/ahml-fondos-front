import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  DiagnosisCatalog,
  CreateDiagnosisCatalog,
  UpdateDiagnosisCatalog,
  DiagnosisCatalogOrderBy,
} from '@models/diagnosis_catalog'

import {
  useGetDiagnosisCatalog,
  useCreateDiagnosisCatalog,
  useUpdateDiagnosisCatalog,
  useDeleteDiagnosisCatalog,
} from '@hooks/catalog/diagnosis_catalogs'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

/* ==========================================================
   CONTEXT TYPE
========================================================== */
interface ContextValue {
  diagnosisCatalog: DiagnosisCatalog[]
  pages: number | null
  current_page: number | null

  order_by: DiagnosisCatalogOrderBy | null
  setOrderBy: (v: DiagnosisCatalogOrderBy| null) => void
  // SEARCH
  query: string
  queryInput: string
  setQuery: (q: string) => void

  // FILTERS
  is_active: boolean | null
  setIsActive: (a: boolean | null) => void

  concept: string | null
  setConcept: (v: string | null) => void

  detail: string | null
  setDetail: (v: string | null) => void

  // PAGINATION
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  refetch: () => Promise<void>

  // SELECTED
  selected: DiagnosisCatalog | null
  setSelected: (u: DiagnosisCatalog | null) => void

  // CREATE
  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateDiagnosisCatalog) => Promise<void>

  // UPDATE
  isEditOpen: boolean
  openEdit: (u: DiagnosisCatalog) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateDiagnosisCatalog) => Promise<void>

  // ENABLE / DISABLE
  isEnableOpen: boolean
  openEnable: (u: DiagnosisCatalog) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: DiagnosisCatalog) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  // DELETE
  isDeleteOpen: boolean
  openDelete: (u: DiagnosisCatalog) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  // SHOW
  isShowOpen: boolean
  openShow: (u: DiagnosisCatalog) => void
  closeShow: () => void

  // STATES
  loadingGet: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean

  errorGet: string | null
  errorCreate: string | null
  errorUpdate: string | null
  errorDelete: string | null
}

const DiagnosisCatalogContext = createContext<ContextValue | null>(null)

export const useDiagnosisCatalog = () => {
  const ctx = useContext(DiagnosisCatalogContext)
  if (!ctx) throw new Error('useDiagnosisCatalog must be inside Provider')
  return ctx
}

/* ==========================================================
   PROVIDER
========================================================== */
export const DiagnosisCatalogProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  /* ==============================
     GET
  ============================== */
  const {
    diagnosisCatalog,
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

    is_active,
    setIsActive,

    concept,
    setConcept,

    detail,
    setDetail,
    order_by,setOrderBy,

    query,
    queryInput,
    setQuery,

    refetch,
  } = useGetDiagnosisCatalog({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  /* ==============================
     CREATE
  ============================== */
  const {
    createDiagnosisCatalog,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateDiagnosisCatalog()

  /* ==============================
     UPDATE
  ============================== */
  const {
    updateDiagnosisCatalog,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateDiagnosisCatalog()

  /* ==============================
     DELETE
  ============================== */
  const {
    deleteDiagnosisCatalog,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteDiagnosisCatalog()

  /* ==============================
     MODALS & SELECTED
  ============================== */
  const [selected, setSelected] = useState<DiagnosisCatalog | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setEnableOpen] = useState(false)
  const [isDisableOpen, setDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: DiagnosisCatalog) => { setSelected(u); setEditOpen(true) }
  const closeEdit = () => { setSelected(null); setEditOpen(false) }

  const openEnable = (u: DiagnosisCatalog) => { setSelected(u); setEnableOpen(true) }
  const closeEnable = () => { setSelected(null); setEnableOpen(false) }

  const openDisable = (u: DiagnosisCatalog) => { setSelected(u); setDisableOpen(true) }
  const closeDisable = () => { setSelected(null); setDisableOpen(false) }

  const openDelete = (u: DiagnosisCatalog) => { setSelected(u); setDeleteOpen(true) }
  const closeDelete = () => { setSelected(null); setDeleteOpen(false) }

  const openShow = (u: DiagnosisCatalog) => { setSelected(u); setShowOpen(true) }
  const closeShow = () => { setSelected(null); setShowOpen(false) }

  /* ==============================
     HANDLERS
  ============================== */
  const handleCreate = async (data: CreateDiagnosisCatalog) => {
    try {
      await createDiagnosisCatalog(data)

      toastSuccess({
        id: 401,
        title: 'Diagnóstico creado',
        message: 'El diagnóstico fue creado correctamente.',
      })

      closeCreate()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 402, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 402,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 402,
        title: 'Error',
        message: 'Error inesperado al crear diagnóstico.',
      })
    }
  }

  const handleUpdate = async (data: UpdateDiagnosisCatalog) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateDiagnosisCatalog

    try {
      await updateDiagnosisCatalog(selected.id, payload)

      toastSuccess({
        id: 403,
        title: 'Diagnóstico actualizado',
        message: 'El diagnóstico fue actualizado correctamente.',
      })

      closeEdit()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 404, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 404,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 404,
        title: 'Error',
        message: 'Error inesperado al actualizar diagnóstico.',
      })
    }
  }

  const handleEnable = async (active: boolean) => {
    if (!selected) return

    try {
      await updateDiagnosisCatalog(selected.id, { is_active: active })

      toastSuccess({
        id: 405,
        title: active ? 'Diagnóstico habilitado' : 'Diagnóstico deshabilitado',
        message: active
          ? 'El diagnóstico está ahora activo.'
          : 'El diagnóstico fue deshabilitado.',
      })

      setSelected(null)
      setEnableOpen(false)
      setDisableOpen(false)
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 406, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 406,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 406,
        title: 'Error',
        message: 'Error inesperado al actualizar estatus.',
      })
    }
  }

  const handleDelete = async () => {
    if (!selected) return

    try {
      await deleteDiagnosisCatalog(selected.id)

      toastSuccess({
        id: 407,
        title: 'Diagnóstico eliminado',
        message: 'El diagnóstico fue eliminado correctamente.',
      })

      closeDelete()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 408, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 408,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 408,
        title: 'Error',
        message: 'Error inesperado al eliminar diagnóstico.',
      })
    }
  }

  /* ==============================
     PROVIDER
  ============================== */
  return (
    <DiagnosisCatalogContext.Provider
      value={{
        diagnosisCatalog,
        pages,
        current_page,
        order_by,setOrderBy,

        query,
        queryInput,
        setQuery,

        is_active,
        setIsActive,

        concept,
        setConcept,

        detail,
        setDetail,

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
    </DiagnosisCatalogContext.Provider>
  )
}
