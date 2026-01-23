import React, { createContext, useContext, useState, ReactNode } from "react"

import {
  MovementHistory,
  CreateMovementHistory,
  UpdateMovementHistory,
  MovementStatus,
} from "@/lib/api/models/movement"

import {
  useGetMovements,
  useCreateMovement,
  useUpdateMovement,
  useDeleteMovement,
} from "@hooks/movements"

import {
  ApiError,
  getApiMessage,
  getStandarMessageError,
} from "@/lib/types/errors"

import { useAuth, useToast } from "@contexts/index"

// =======================================
// CONTEXT SHAPE
// =======================================

interface ContextValue {
  movements: MovementHistory[]
  pages: number | null
  current_page: number | null
  totalItems: number

  // SEARCH
  query: string
  queryInput: string
  setQuery: (q: string) => void

  // FILTERS
  movedAfter: string | null
  movedBefore: string | null
  originStatus: MovementStatus | null
  destinationStatus: MovementStatus | null

  setMovedAfter: (v: string | null) => void
  setMovedBefore: (v: string | null) => void
  setOriginStatus: (v: MovementStatus | null) => void
  setDestinationStatus: (v: MovementStatus | null) => void

  // PAGINATION
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  // Refetch
  refetch: () => Promise<void>

  // Selected
  selected: MovementHistory | null
  setSelected: (m: MovementHistory | null) => void

  // MODALS
  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateMovementHistory) => Promise<void>

  isEditOpen: boolean
  openEdit: (m: MovementHistory) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateMovementHistory) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (m: MovementHistory) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (m: MovementHistory) => void
  closeShow: () => void

  // Loading
  loadingGet: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean

  // Errors
  errorGet: string | null
  errorCreate: string | null
  errorUpdate: string | null
  errorDelete: string | null
}

const MovementsContext = createContext<ContextValue | null>(null)

export const useMovements = () => {
  const ctx = useContext(MovementsContext)
  if (!ctx) throw new Error("useMovements must be inside MovementsProvider")
  return ctx
}

// =======================================
// PROVIDER
// =======================================

export const MovementsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // =======================================
  // GET MOVEMENTS
  // =======================================
  const {
    movements,
    loading: loadingGet,
    error: errorGet,

  totalItems,
    currentPage: current_page,
    totalPages: pages,

    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goNext,
    goPrev,

    movedAfter,
    movedBefore,
    setMovedAfter,
    setMovedBefore,

    originStatus,
    destinationStatus,
    setOriginStatus,
    setDestinationStatus,

    query,
    queryInput,
    setQuery,

    refetch,
  } = useGetMovements({
    initialPage: 1,
    initialPerPage: 20,
  })

  // =======================================
  // CREATE MOVEMENT
  // =======================================
  const {
    createMovement,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateMovement()

  // =======================================
  // UPDATE MOVEMENT
  // =======================================
  const {
    updateMovement,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateMovement()

  // =======================================
  // DELETE MOVEMENT
  // =======================================
  const {
    deleteMovement,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteMovement()

  // =======================================
  // SELECTED + MODALS
  // =======================================
  const [selected, setSelected] = useState<MovementHistory | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  // Create
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  // Edit
  const openEdit = (m: MovementHistory) => {
    setSelected(m)
    setEditOpen(true)
  }
  const closeEdit = () => {
    setSelected(null)
    setEditOpen(false)
  }

  // Delete
  const openDelete = (m: MovementHistory) => {
    setSelected(m)
    setDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelected(null)
    setDeleteOpen(false)
  }

  // Show
  const openShow = (m: MovementHistory) => {
    setSelected(m)
    setShowOpen(true)
  }
  const closeShow = () => {
    setSelected(null)
    setShowOpen(false)
  }

  // =======================================
  // HANDLERS
  // =======================================

  const handleCreate = async (data: CreateMovementHistory) => {
    try {
      await createMovement(data)
      toastSuccess({
        id: 901,
        title: "Movimiento registrado",
        message: "El movimiento fue creado correctamente.",
      })
      closeCreate()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg === "Sesión expirada.") await logout()
      return toastError({ id: 902, title: "Error", message: msg || getApiMessage(err as ApiError) })
    }
  }

  const handleUpdate = async (data: UpdateMovementHistory) => {
    if (!selected) return
    try {
      await updateMovement(selected.id, data)
      toastSuccess({
        id: 903,
        title: "Movimiento actualizado",
        message: "El movimiento fue actualizado correctamente.",
      })
      closeEdit()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg === "Sesión expirada.") await logout()
      return toastError({ id: 904, title: "Error", message: msg || getApiMessage(err as ApiError) })
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    try {
      await deleteMovement(selected.id)
      toastSuccess({
        id: 905,
        title: "Movimiento eliminado",
        message: "El movimiento fue eliminado correctamente.",
      })
      closeDelete()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg === "Sesión expirada.") await logout()
      return toastError({ id: 906, title: "Error", message: msg || getApiMessage(err as ApiError) })
    }
  }

  return (
    <MovementsContext.Provider
      value={{
        movements,
        pages,
        current_page,
        totalItems,

        query,
        queryInput,
        setQuery,

        movedAfter,
        movedBefore,
        originStatus,
        destinationStatus,

        setMovedAfter,
        setMovedBefore,
        setOriginStatus,
        setDestinationStatus,

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
    </MovementsContext.Provider>
  )
}
