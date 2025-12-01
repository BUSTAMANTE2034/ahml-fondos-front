import React, { createContext, useContext, useState, ReactNode } from 'react'

import { Loan, CreateLoan, UpdateLoan } from '@models/loan'

import {
  useGetLoans,
  useCreateLoan,
  useUpdateLoan,
  useReceiveLoan,
  useDeleteLoan,
} from '@hooks/loans'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

// =======================================
// CONTEXT SHAPE
// =======================================

interface ContextValue {
  loans: Loan[]
  pages: number | null
  current_page: number | null

  // SEARCH
  query: string
  queryInput: string
  setQuery: (q: string) => void

  // FILTERS
  active: boolean | null
  setActive: (v: boolean | null) => void

  loadedAfter: string | null
  loadedBefore: string | null
  returnedAfter: string | null
  returnedBefore: string | null

  setLoadedAfter: (v: string | null) => void
  setLoadedBefore: (v: string | null) => void
  setReturnedAfter: (v: string | null) => void
  setReturnedBefore: (v: string | null) => void

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
  selected: Loan | null
  setSelected: (u: Loan | null) => void

  // MODALS
  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateLoan) => Promise<void>

  isEditOpen: boolean
  openEdit: (u: Loan) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateLoan) => Promise<void>

  isReceiveOpen: boolean
  openReceive: (u: Loan) => void
  closeReceive: () => void
  handleReceive: () => Promise<void>

  isDeleteOpen: boolean
  openDelete: (u: Loan) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (u: Loan) => void
  closeShow: () => void

  // Loadings
  loadingGet: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingReceive: boolean
  loadingDelete: boolean

  // Errors
  errorGet: string | null
  errorCreate: string | null
  errorUpdate: string | null
  errorReceive: string | null
  errorDelete: string | null
}

const LoansContext = createContext<ContextValue | null>(null)

export const useLoans = () => {
  const ctx = useContext(LoansContext)
  if (!ctx) throw new Error('useLoans must be inside LoansProvider')
  return ctx
}

// =======================================
// PROVIDER
// =======================================

export const LoansProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // =======================================
  // GET LOANS
  // =======================================
  const {
    loans,
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

    active,
    setActive,

    loadedAfter,
    loadedBefore,
    returnedAfter,
    returnedBefore,

    setLoadedAfter,
    setLoadedBefore,
    setReturnedAfter,
    setReturnedBefore,

    query,
    queryInput,
    setQuery,

    refetch,
  } = useGetLoans({
    initialPage: 1,
    initialPerPage: 20,
    initialActive: null,
  })

  // =======================================
  // CREATE
  // =======================================
  const {
    createLoan,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateLoan()

  // =======================================
  // UPDATE (solo descripción)
  // =======================================
  const {
    updateLoan,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateLoan()

  // =======================================
  // RECEIVE (devolver préstamo)
  // =======================================
  const {
    receiveLoan,
    loading: loadingReceive,
    error: errorReceive,
  } = useReceiveLoan()

  // =======================================
  // DELETE
  // =======================================
  const {
    deleteLoan,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteLoan()

  // =======================================
  // SELECTED + MODALS
  // =======================================
  const [selected, setSelected] = useState<Loan | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isReceiveOpen, setReceiveOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: Loan) => {
    setSelected(u)
    setEditOpen(true)
  }
  const closeEdit = () => {
    setSelected(null)
    setEditOpen(false)
  }

  const openReceive = (u: Loan) => {
    setSelected(u)
    setReceiveOpen(true)
  }
  const closeReceive = () => {
    setSelected(null)
    setReceiveOpen(false)
  }

  const openDelete = (u: Loan) => {
    setSelected(u)
    setDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelected(null)
    setDeleteOpen(false)
  }

  const openShow = (u: Loan) => {
    setSelected(u)
    setShowOpen(true)
  }
  const closeShow = () => {
    setSelected(null)
    setShowOpen(false)
  }

  // =======================================
  // CREATE HANDLER
  // =======================================
  const handleCreate = async (data: CreateLoan) => {
    try {
      await createLoan(data)
     

      toastSuccess({
        id: 701,
        title: 'Préstamo creado',
        message: 'El préstamo fue creado correctamente.',
      })

      closeCreate() 
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 702, title: 'Error', message: msg })
      }

      return toastError({
        id: 702,
        title: 'Error',
        message: getApiMessage(err as ApiError),
      })
    }
  }

  // =======================================
  // UPDATE HANDLER
  // =======================================
  const handleUpdate = async (data: UpdateLoan) => {
    if (!selected) return

    try {
      await updateLoan(selected.id, data)
     

      toastSuccess({
        id: 703,
        title: 'Préstamo actualizado',
        message: 'La descripción fue actualizada correctamente.',
      })

      closeEdit() 
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 704, title: 'Error', message: msg })
      }

      return toastError({
        id: 704,
        title: 'Error',
        message: getApiMessage(err as ApiError),
      })
    }
  }

  // =======================================
  // RECEIVE HANDLER
  // =======================================
  const handleReceive = async () => {
    if (!selected) return

    try {
      await receiveLoan(selected.id)
      

      toastSuccess({
        id: 705,
        title: 'Préstamo devuelto',
        message: 'El expediente fue marcado como devuelto.',
      })

      closeReceive()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 706, title: 'Error', message: msg })
      }

      return toastError({
        id: 706,
        title: 'Error',
        message: getApiMessage(err as ApiError),
      })
    }
  }

  // =======================================
  // DELETE HANDLER
  // =======================================
  const handleDelete = async () => {
    if (!selected) return

    try {
      await deleteLoan(selected.id)
      await refetch()

      toastSuccess({
        id: 707,
        title: 'Préstamo eliminado',
        message: 'El préstamo fue eliminado correctamente.',
      })

      closeDelete()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 708, title: 'Error', message: msg })
      }

      return toastError({
        id: 708,
        title: 'Error',
        message: getApiMessage(err as ApiError),
      })
    }
  }

  return (
    <LoansContext.Provider
      value={{
        loans,
        pages,
        current_page,

        query,
        queryInput,
        setQuery,

        active,
        setActive,

        loadedAfter,
        loadedBefore,
        returnedAfter,
        returnedBefore,

        setLoadedAfter,
        setLoadedBefore,
        setReturnedAfter,
        setReturnedBefore,

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

        isReceiveOpen,
        openReceive,
        closeReceive,
        handleReceive,

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
        loadingReceive,
        loadingDelete,

        errorGet,
        errorCreate,
        errorUpdate,
        errorReceive,
        errorDelete,
      }}
    >
      {children}
    </LoansContext.Provider>
  )
}
