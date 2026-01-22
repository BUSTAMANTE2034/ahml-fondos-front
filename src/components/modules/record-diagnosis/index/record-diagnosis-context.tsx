import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react'

import {
  RecordDiagnosis,
  CreateRecordDiagnosis,
  UpdateRecordDiagnosis,
} from '@/lib/api/models/record_diagnosis'

import {
  useGetRecordDiagnosis,
  useCreateRecordDiagnosis,
  useUpdateRecordDiagnosis,
  useDeleteRecordDiagnosis,
} from '@/lib/api/hooks/record-diagnosis'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'

/* ==========================================================
   CONTEXT INTERFACE
========================================================== */
interface ContextValue {
  recordDiagnoses: RecordDiagnosis[]
  pages: number
  current_page: number | null

  query: string
  queryInput: string
  setQuery: (q: string) => void

  diagnosisDetail: string
  setDiagnosisDetail: (d: string) => void

  // filters
  record_file_id: number | null
  setRecordFileId: (id: number | null) => void

  user_id: number | null
  setUserId: (id: number | null) => void

  start_date: string | null
  end_date: string | null
  setStartDate: (d: string | null) => void
  setEndDate: (d: string | null) => void

  // pagination
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  refetch: () => Promise<void>

  // selected
  selected: RecordDiagnosis | null
  setSelected: (r: RecordDiagnosis | null) => void

  // modals
  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateRecordDiagnosis) => Promise<void>

  isEditOpen: boolean
  openEdit: (r: RecordDiagnosis) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateRecordDiagnosis) => Promise<void>

  isDeleteOpen: boolean
  openDelete: (r: RecordDiagnosis) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  isShowOpen: boolean
  openShow: (r: RecordDiagnosis) => void
  closeShow: () => void

  // loading & errors
  loadingGet: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean

  errorGet: string | null
  errorCreate: string | null
  errorUpdate: string | null
  errorDelete: string | null
}

const RecordDiagnosisContext = createContext<ContextValue | null>(null)

export const useRecordDiagnosis = () => {
  const ctx = useContext(RecordDiagnosisContext)
  if (!ctx) {
    throw new Error('useRecordDiagnosis must be inside RecordDiagnosisProvider')
  }
  return ctx
}

/* ==========================================================
   PROVIDER
========================================================== */
export const RecordDiagnosisProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  /* ========================================================
     GET (main)
  ======================================================== */
  const {
    recordDiagnoses,
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

    record_file_id,
    setRecordFileId,

    user_id,
    setUserId,

    start_date,
    end_date,
    setStartDate,
    setEndDate,
    query,
  queryInput,
  setQuery,
  diagnosisDetail,
  setDiagnosisDetail,
    refetch,
  } = useGetRecordDiagnosis({
    initialPage: 1,
    initialPerPage: 5,
  })

  /* ========================================================
     CREATE
  ======================================================== */
  const {
    createRecordDiagnosis,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateRecordDiagnosis()

  /* ========================================================
     UPDATE
  ======================================================== */
  const {
    updateRecordDiagnosis,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateRecordDiagnosis()

  /* ========================================================
     DELETE
  ======================================================== */
  const {
    deleteRecordDiagnosis,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteRecordDiagnosis()

  /* ========================================================
     MODALS & SELECTED
  ======================================================== */
  const [selected, setSelected] = useState<RecordDiagnosis | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)

  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (r: RecordDiagnosis) => {
    setSelected(r)
    setEditOpen(true)
  }
  const closeEdit = () => {
    setSelected(null)
    setEditOpen(false)
  }

  const openDelete = (r: RecordDiagnosis) => {
    setSelected(r)
    setDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelected(null)
    setDeleteOpen(false)
  }

  const openShow = (r: RecordDiagnosis) => {
    setSelected(r)
    setShowOpen(true)
  }
  const closeShow = () => {
    setSelected(null)
    setShowOpen(false)
  }

  /* ========================================================
     CREATE HANDLER
  ======================================================== */
  const handleCreate = async (data: CreateRecordDiagnosis) => {
    try {
      await createRecordDiagnosis(data)

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

  /* ========================================================
     UPDATE HANDLER
  ======================================================== */
  const handleUpdate = async (data: UpdateRecordDiagnosis) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(
        ([_, v]) => v !== null && v !== undefined && v !== ''
      )
    ) as UpdateRecordDiagnosis

    try {
      await updateRecordDiagnosis(selected.id, payload)

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

  /* ========================================================
     DELETE HANDLER
  ======================================================== */
  const handleDelete = async () => {
    if (!selected) return

    try {
      await deleteRecordDiagnosis(selected.id)

      toastSuccess({
        id: 405,
        title: 'Diagnóstico eliminado',
        message: 'El diagnóstico fue eliminado correctamente.',
      })

      closeDelete()
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
        message: 'Error inesperado al eliminar diagnóstico.',
      })
    }
  }

  return (
    <RecordDiagnosisContext.Provider
      value={{
        recordDiagnoses,
        pages,
        current_page,

        record_file_id,
        setRecordFileId,

        user_id,
        setUserId,

        start_date,
        end_date,
        setStartDate,
        setEndDate,
        query,
    queryInput,
    setQuery,
    diagnosisDetail,
    setDiagnosisDetail,


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
    </RecordDiagnosisContext.Provider>
  )
}
