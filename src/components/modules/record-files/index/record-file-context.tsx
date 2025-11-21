import React, { createContext, useContext, useState, ReactNode } from "react"

import {
  RecordFile,
  CreateRecordFile,
  UpdateRecordFile,
} from "@models/record-file"

import {
  useGetRecordFiles,
  useCreateRecordFile,
  useUpdateRecordFile,
  useDeleteRecordFile,
  useExportRecordFilesPDF,
  usePrintCoverPage,
} from "@hooks/record-files/index"

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from "@/lib/types/errors"

import { useToast, useAuth } from "@contexts/index"

interface ContextValue {
  recordFiles: RecordFile[]
  pages: number | null
  current_page: number | null

  // búsqueda
  query: string
  queryInput: string
  setQuery: (q: string) => void

  // pagination
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  // filtros adicionales
  fund_id: number | null
  setFundId: (v: number | null) => void
  section_id: number | null
  setSectionId: (v: number | null) => void
  series_id: number | null
  setSeriesId: (v: number | null) => void
  location_id: number | null
  setLocationId: (v: number | null) => void
  deterioration_status_id: number | null
  setDeteriorationStatusId: (v: number | null) => void
  availability_status: string | null
  setAvailabilityStatus: (v: string | null) => void
  created_after: string | null
  setCreatedAfter: (d: string | null) => void
  created_before: string | null
  setCreatedBefore: (d: string | null) => void
  file_date_after: string | null
  setFileDateAfter: (d: string | null) => void
  file_date_before: string | null
  setFileDateBefore: (d: string | null) => void
  typology_ids: number[]
  setTypologyIds: (arr: number[]) => void

  // refetch
  refetch: () => Promise<void>

  // selected for modals
  selected: RecordFile | null
  setSelected: (u: RecordFile | null) => void

  // create
  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateRecordFile) => Promise<void>

  // edit
  isEditOpen: boolean
  openEdit: (u: RecordFile) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateRecordFile) => Promise<void>

  // delete
  isDeleteOpen: boolean
  openDelete: (u: RecordFile) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  // show
  isShowOpen: boolean
  openShow: (u: RecordFile) => void
  closeShow: () => void

  // export list PDF
  isExportOpen: boolean
  openExport: () => void
  closeExport: () => void
  handleExport: () => Promise<void>

  // print cover page
  isCoverOpen: boolean
  openCover: (u: RecordFile) => void
  closeCover: () => void
  handlePrintCover: () => Promise<void>

  // loading states
  loadingGet: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean
  loadingExport: boolean
  loadingPrint: boolean

  // errors
  errorGet: string | null
  errorCreate: string | null
  errorUpdate: string | null
  errorDelete: string | null
  errorExport: string | null
  errorPrint: string | null
}

const RecordFilesContext = createContext<ContextValue | null>(null)

export const useRecordFiles = () => {
  const ctx = useContext(RecordFilesContext)
  if (!ctx) throw new Error("useRecordFiles must be inside RecordFilesProvider")
  return ctx
}

export const RecordFilesProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // ==========================================================
  // GET RECORD FILES
  // ==========================================================
  const {
    recordFiles,
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

    query,
    queryInput,
    setQuery,

    fund_id,
    setFundId,
    section_id,
    setSectionId,
    series_id,
    setSeriesId,
    location_id,
    setLocationId,
    deterioration_status_id,
    setDeteriorationStatusId,
    availability_status,
    setAvailabilityStatus,
    created_after,
    setCreatedAfter,
    created_before,
    setCreatedBefore,
    file_date_after,
    setFileDateAfter,
    file_date_before,
    setFileDateBefore,
    typology_ids,
    setTypologyIds,

    refetch,
  } = useGetRecordFiles()

  // ==========================================================
  // CREATE
  // ==========================================================
  const {
    createRecordFile,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateRecordFile()

  // ==========================================================
  // UPDATE
  // ==========================================================
  const {
    updateRecordFile,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateRecordFile()

  // ==========================================================
  // DELETE
  // ==========================================================
  const {
    deleteRecordFile,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteRecordFile()

  // ==========================================================
  // EXPORT PDF (LIST)
  // ==========================================================
  const {
    exportPDF,
    loading: loadingExport,
    error: errorExport,
  } = useExportRecordFilesPDF()

  // ==========================================================
  // PRINT COVER PAGE
  // ==========================================================
  const {
    printCover,
    loading: loadingPrint,
    error: errorPrint,
  } = usePrintCoverPage()

  // ==========================================================
  // MODALS & SELECTED
  // ==========================================================
  const [selected, setSelected] = useState<RecordFile | null>(null)

  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)
  const [isExportOpen, setExportOpen] = useState(false)
  const [isCoverOpen, setCoverOpen] = useState(false)

  // Create
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  // Edit
  const openEdit = (u: RecordFile) => {
    setSelected(u)
    setEditOpen(true)
  }
  const closeEdit = () => {
    setSelected(null)
    setEditOpen(false)
  }

  // Delete
  const openDelete = (u: RecordFile) => {
    setSelected(u)
    setDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelected(null)
    setDeleteOpen(false)
  }

  // Show
  const openShow = (u: RecordFile) => {
    setSelected(u)
    setShowOpen(true)
  }
  const closeShow = () => {
    setSelected(null)
    setShowOpen(false)
  }

  // Export PDF
  const openExport = () => setExportOpen(true)
  const closeExport = () => setExportOpen(false)

  // Cover Page
  const openCover = (u: RecordFile) => {
    setSelected(u)
    setCoverOpen(true)
  }
  const closeCover = () => {
    setSelected(null)
    setCoverOpen(false)
  }

  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreate = async (data: CreateRecordFile) => {
    try {
      await createRecordFile(data)
      await refetch()

      toastSuccess({
        id: 301,
        title: "Expediente creado",
        message: "El expediente fue creado correctamente.",
      })

      closeCreate()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === "Sesión expirada.") await logout()
        return toastError({ id: 302, title: "Error", message: msg })
      throw err 
      }

      toastError({
        id: 302,
        title: "Error",
        message: getApiMessage(err as ApiError),
      })
      throw err 
    }
  }

  // ==========================================================
  // UPDATE HANDLER
  // ==========================================================
  const handleUpdate = async (data: UpdateRecordFile) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "" && v !== null)
    ) as UpdateRecordFile

    try {
      await updateRecordFile(selected.id, payload)
      await refetch()

      toastSuccess({
        id: 303,
        title: "Expediente actualizado",
        message: "El expediente fue actualizado correctamente.",
      })

      closeEdit()
    } catch (err) {
      const msg = getStandarMessageError(err)

      if (msg) {
        if (msg === "Sesión expirada.") await logout()
        return toastError({ id: 304, title: "Error", message: msg })
      throw err 
      }

      toastError({
        id: 304,
        title: "Error",
        message: getApiMessage(err as ApiError),
      })
      throw err 
    }
  }

  // ==========================================================
  // DELETE HANDLER
  // ==========================================================
  const handleDelete = async () => {
    if (!selected) return

    try {
      await deleteRecordFile(selected.id)
      await refetch()

      toastSuccess({
        id: 307,
        title: "Expediente eliminado",
        message: "El expediente fue eliminado correctamente.",
      })

      closeDelete()
    } catch (err) {
      const msg = getStandarMessageError(err)

      if (msg) {
        if (msg === "Sesión expirada.") await logout()
        return toastError({ id: 308, title: "Error", message: msg })
      }

      toastError({
        id: 308,
        title: "Error",
        message: getApiMessage(err as ApiError),
      })
    }
  }

  // ==========================================================
  // EXPORT LIST PDF
  // ==========================================================
  const handleExport = async () => {
    try {
      await exportPDF()
      toastSuccess({
        id: 401,
        title: "Exportado",
        message: "El PDF fue generado correctamente.",
      })
      closeExport()
    } catch (err) {
      toastError({
        id: 402,
        title: "Error al exportar",
        message: getApiMessage(err as ApiError),
      })
    }
  }

  // ==========================================================
  // PRINT COVER PAGE
  // ==========================================================
  const handlePrintCover = async () => {
    if (!selected) return
    try {
      await printCover(selected.id)
      toastSuccess({
        id: 501,
        title: "Carátula generada",
        message: "La carátula del expediente fue generada correctamente.",
      })
      closeCover()
    } catch (err) {
      toastError({
        id: 502,
        title: "Error al generar carátula",
        message: getApiMessage(err as ApiError),
      })
    }
  }

  // ==========================================================
  // RETURN PROVIDER
  // ==========================================================
  return (
    <RecordFilesContext.Provider
      value={{
        recordFiles,
        pages,
        current_page,

        query,
        queryInput,
        setQuery,

        fund_id,
        setFundId,
        section_id,
        setSectionId,
        series_id,
        setSeriesId,
        location_id,
        setLocationId,
        deterioration_status_id,
        setDeteriorationStatusId,
        availability_status,
        setAvailabilityStatus,

        created_after,
        created_before,
        setCreatedAfter,
        setCreatedBefore,

        file_date_after,
        file_date_before,
        setFileDateAfter,
        setFileDateBefore,

        typology_ids,
        setTypologyIds,

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

        isExportOpen,
        openExport,
        closeExport,
        handleExport,

        isCoverOpen,
        openCover,
        closeCover,
        handlePrintCover,

        loadingGet,
        loadingCreate,
        loadingUpdate,
        loadingDelete,
        loadingExport,
        loadingPrint,

        errorGet,
        errorCreate,
        errorUpdate,
        errorDelete,
        errorExport,
        errorPrint,
      }}
    >
      {children}
    </RecordFilesContext.Provider>
  )
}
