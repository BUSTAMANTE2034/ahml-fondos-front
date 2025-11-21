import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  Catalog_Key,
  CreateCatalog_Key,
  UpdateCatalog_Key,
} from '@models/catalog-key'

import {
  useGetCatalogKeys,
  useCreateCatalogKey,
  useUpdateCatalogKey,
  useDeleteCatalogKey,
} from '@hooks/catalog/catalog-keys'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'
import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  keys: Catalog_Key[]
  pages: number | null
  current_page: number | null
  total: number | null

  query: string
  queryInput: string
  setQuery: (q: string) => void

  is_active: boolean | null
  setIsActive: (a: boolean | null) => void
  entity_type: string[]
setEntityType: (s: string[]) => void


  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  getKeys: () => Promise<void>

  selected: Catalog_Key | null
  setSelected: (u: Catalog_Key | null) => void

  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateCatalog_Key) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: Catalog_Key) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateCatalog_Key) => Promise<void>

  isEnableOpen: boolean
  openEnable: (u: Catalog_Key) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: Catalog_Key) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: Catalog_Key) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: Catalog_Key) => void
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

const KeysContext = createContext<ContextValue | null>(null)

export const useKeys = () => {
  const ctx = useContext(KeysContext)
  if (!ctx) throw new Error('useKeys must be inside KeysProvider')
  return ctx
}

export const KeysProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // ────────────────────────────────────────────
  // GET KEYS
  // ────────────────────────────────────────────
  const {
    catalog_keys: keys,
    loading: loadingGet,
    error: errorGet,
    total,
    pages,
    current_page,

    query,
    queryInput,
    setQuery,

    is_active,
    setIsActive,
    entity_type,
    setEntityType,

    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goNext,
    goPrev,

    getCatalogKeys: getKeys,
  } = useGetCatalogKeys({
    initialPage: 1,
    initialPerPage: 20,
    initialIsActive: null,
  })

  // CREATE
  const {
    createCatalogKey,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateCatalogKey()

  // UPDATE
  const {
    updateCatalogKey,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateCatalogKey()

  // DELETE
  const {
    deleteCatalogKey,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteCatalogKey()

  // ────────────────────────────────────────────
  // MODALS & SELECTED
  // ────────────────────────────────────────────
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setIsEnableOpen] = useState(false)
  const [isDisableOpen, setIsDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setIsShowOpen] = useState(false)
  const [selected, setSelected] = useState<Catalog_Key | null>(null)
  // ────────────────────────────────────────────
  // MODAL HANDLERS
  // ────────────────────────────────────────────
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: Catalog_Key) => {
    setSelected(u)
    setEditOpen(true)
  }
  const closeEdit = () => {
    setSelected(null)
    setEditOpen(false)
  }

  const openEnable = (u: Catalog_Key) => {
    setSelected(u)
    setIsEnableOpen(true)
  }
  const closeEnable = () => {
    setSelected(null)
    setIsEnableOpen(false)
  }

  const openDisable = (u: Catalog_Key) => {
    setSelected(u)
    setIsDisableOpen(true)
  }
  const closeDisable = () => {
    setSelected(null)
    setIsDisableOpen(false)
  }

  const openDelete = (u: Catalog_Key) => {
    setSelected(u)
    setDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelected(null)
    setDeleteOpen(false)
  }

  const openShow = (u: Catalog_Key) => {
    setSelected(u)
    setIsShowOpen(true)
  }
  const closeShow = () => {
    setSelected(null)
    setIsShowOpen(false)
  }

  // ────────────────────────────────────────────
  // CREATE
  // ────────────────────────────────────────────
  const handleCreate = async (data: CreateCatalog_Key) => {
    try {
      await createCatalogKey(data)
      await getKeys()

      toastSuccess({
        id: 102,
        title: '¡Éxito!',
        message: 'Clave creada correctamente',
      })

      closeCreate()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 103, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 103,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 103,
        title: 'Error',
        message: 'Error inesperado al crear clave',
      })
    }
  }

  // ────────────────────────────────────────────
  // UPDATE
  // ────────────────────────────────────────────
  const handleUpdate = async (data: UpdateCatalog_Key) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateCatalog_Key

    try {
      await updateCatalogKey(selected.id, payload)
      await getKeys()

      toastSuccess({
        id: 104,
        title: '¡Éxito!',
        message: 'Clave actualizada correctamente',
      })

      closeEdit()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 105, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 105,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({ id: 105, title: 'Error', message: 'Error inesperado.' })
    }
  }

  // ────────────────────────────────────────────
  // ENABLE / DISABLE
  // ────────────────────────────────────────────
  const handleEnable = async (active: boolean) => {
    if (!selected) return

    try {
      await updateCatalogKey(selected.id, { is_active: active })
      await getKeys()

      toastSuccess({
        id: 108,
        title: '¡Éxito!',
        message: active ? 'Clave habilitada' : 'Clave deshabilitada',
      })

      setSelected(null)
      setIsEnableOpen(false)
      setIsDisableOpen(false)
    } catch (err) {
      const msg = getStandarMessageError(err)

      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 109, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 109,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({ id: 109, title: 'Error', message: 'Error inesperado.' })
    }
  }

  // ────────────────────────────────────────────
  // DELETE
  // ────────────────────────────────────────────
  const handleDelete = async () => {
    if (!selected) return

    try {
      await deleteCatalogKey(selected.id)
      await getKeys()

      toastSuccess({
        id: 106,
        title: '¡Éxito!',
        message: 'Clave eliminada correctamente',
      })

      closeDelete()
    } catch (err) {
      const msg = getStandarMessageError(err)

      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 107, title: 'Error', message: msg })
      }

      if (err instanceof ApiError) {
        return toastError({
          id: 107,
          title: 'Error',
          message: getApiMessage(err),
        })
      }

      toastError({
        id: 107,
        title: 'Error',
        message: 'Error inesperado al eliminar clave',
      })
    }
  }

  return (
    <KeysContext.Provider
      value={{
        keys,
        pages,
        current_page,
        total,
        entity_type,
        setEntityType,
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

        getKeys,

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
    </KeysContext.Provider>
  )
}
