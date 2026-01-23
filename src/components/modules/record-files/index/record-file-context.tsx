import React, { createContext, useContext, useState, ReactNode } from 'react'

import {
  RecordFile,
  CreateRecordFile,
  UpdateRecordFile,
  RecordFileAvailability,
  RecordFileOrderByParam,
} from '@models/record-file'
import { useCreateMovement } from '@hooks/movements'

import {
  useGetRecordFiles,
  useCreateRecordFile,
  useUpdateRecordFile,
  useDeleteRecordFile,
  useExportRecordFilesPDF,
  usePrintCoverPage,
  useReorderRecordFiles,
} from '@hooks/record-files'

import { useCreateLoan, useReceiveLoanRecord } from '@hooks/loans'

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'

import { useToast, useAuth } from '@contexts/index'
import { CreateLoan, Loan } from '@/lib/api/models/loan'
import { useLocation, useNavigate } from 'react-router-dom'
import { CreateMovementHistory } from '@/lib/api/models/movement'

// ============================================
// CONTEXT TYPES
// ============================================
interface ContextValue {
  recordFiles: RecordFile[]
  pages: number | null
  current_page: number | null

  // búsqueda global
  query: string
  queryInput: string
  setQuery: (q: string) => void
  totalItems: number

  // pagination
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  // ====== FILTROS DIRECTOS ======
  reference_code: string
  setReferenceCode: (v: string) => void

  previous_reference_code: string
  setPreviousReferenceCode: (v: string) => void

  file_number: string
  setFileNumber: (v: string) => void

  box_number: string
  setBoxNumber: (v: string) => void

  // ====== CONFIDENCIALIDAD ======
  sensitive: 'all' | 'delicate' | 'not_delicate'
  setSensitive: (v: 'all' | 'delicate' | 'not_delicate') => void

  // ====== FILTROS POR NOMBRE ======
  fund_name: string
  setFundName: (v: string) => void

  section_name: string
  setSectionName: (v: string) => void

  series_name: string
  setSeriesName: (v: string) => void

  location_name: string
  setLocationName: (v: string) => void

  deterioration_name: string
  setDeteriorationName: (v: string) => void

  user_query: string
  setUserQuery: (v: string) => void

  typology_name: string
  setTypologyName: (v: string) => void

  // disponibilidad
  availability_status: RecordFileAvailability | 'all'
  setAvailabilityStatus: (v: RecordFileAvailability | 'all') => void

  // fechas documentales
  file_date_after: string | null
  setFileDateAfter: (v: string | null) => void
  file_date_before: string | null
  setFileDateBefore: (v: string | null) => void

  // order
  order_by: RecordFileOrderByParam | null
  setOrderBy: (v: RecordFileOrderByParam | null) => void

  // refetch
  refetch: () => Promise<void>

  // selected for modals
  selected: RecordFile | null
  setSelected: (u: RecordFile | null) => void

  selectedLoan: Loan | null
  setSelectedLoan: (u: Loan | null) => void

  // CREATE
  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateRecordFile) => Promise<void>

  // EDIT
  isEditOpen: boolean
  openEdit: (u: RecordFile) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateRecordFile) => Promise<void>

  // DELETE
  isDeleteOpen: boolean
  openDelete: (u: RecordFile) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  // SHOW
  isShowOpen: boolean
  openShow: (u: RecordFile) => void
  closeShow: () => void

  // EXPORT PDF
  isExportOpen: boolean
  openExport: () => void
  closeExport: () => void
  handleExport: () => Promise<void>

  // EXPORT EXCEL
  isExportExcelOpen: boolean
  openExportExcel: () => void
  closeExportExcel: () => void

  // PRINT COVER
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
  loadingCreateLoan: boolean
  loadingReceive: boolean
  loadingCreateMovement: boolean
  loadingReorder: boolean
  errorCreateMovement: string | null

  // errors
  errorGet: string | null
  errorCreate: string | null
  errorUpdate: string | null
  errorDelete: string | null
  errorExport: string | null
  errorPrint: string | null
  errorCreateLoan: string | null
  errorReceive: string | null
  errorReorder: string | null

  resetFilters: () => void

  //CREATE
  isCreateLoanOpen: boolean
  openCreateLoan: (u: RecordFile) => void
  closeCreateLoan: () => void
  handleCreateLoan: (data: CreateLoan) => Promise<void>

  //REORDER
  isReorderOpen: boolean
  openReorder: () => void
  closeReorder: () => void
  handleReorderAll: () => Promise<void>
  handleReorderWithFilters: (filters: {
    fund_id?: string
    section_id?: string
    series_id?: number
    box_number?: number
  }) => Promise<void>

  //CREATE MOVEMENT
  isCreateMovementOpen: boolean
  openCreateMovement: (u: RecordFile) => void
  closeCreateMovement: () => void
  handleCreateMovement: (data: CreateMovementHistory) => Promise<void>

  //RECIEVE
  isReceiveOpen: boolean
  openReceive: (u: RecordFile) => void
  closeReceive: () => void
  handleReceive: () => Promise<void>
}

const RecordFilesContext = createContext<ContextValue | null>(null)

export const useRecordFiles = () => {
  const ctx = useContext(RecordFilesContext)
  if (!ctx) throw new Error('useRecordFiles must be inside RecordFilesProvider')
  return ctx
}

export const RecordFilesProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const goLoans = () => {
    const parts = location.pathname.split('/')
    parts[parts.length - 1] = 'loans' // reemplaza el último segmento

    const newPath = parts.join('/')
    navigate(newPath)
  }
  // ==========================================================
  // GET RECORD FILES (HOOK COMPLETO Y CORREGIDO)
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
    totalItems,

    query,
    queryInput,
    setQuery,

    // directos
    reference_code,
    setReferenceCode,
    previous_reference_code,
    setPreviousReferenceCode,
    file_number,
    setFileNumber,
    box_number,
    setBoxNumber,
    user_query,setUserQuery,

    // confidencialidad
    sensitive,
    setSensitive,

    // filtros por nombre
    fund_name,
    setFundName,
    section_name,
    setSectionName,
    series_name,
    setSeriesName,
    location_name,
    setLocationName,
    deterioration_name,
    setDeteriorationName,
    typology_name,
    setTypologyName,

    // disponibilidad
    availability_status,
    setAvailabilityStatus,

    // fechas documentales
    file_date_after,
    setFileDateAfter,
    file_date_before,
    setFileDateBefore,

    // ordenamiento
    order_by,
    setOrderBy,


    refetch,
  } = useGetRecordFiles()

  const {
    createLoan,
    loading: loadingCreateLoan,
    error: errorCreateLoan,
  } = useCreateLoan()

  // =======================================
  // UPDATE (solo descripción)
  // =======================================

  // =======================================
  // RECEIVE (devolver préstamo)
  // =======================================
  const {
    receiveLoanRecord,
    loading: loadingReceive,
    error: errorReceive,
  } = useReceiveLoanRecord()

  const {
    reorderRecordFiles,
    loading: loadingReorder,
    error: errorReorder,
  } = useReorderRecordFiles()
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
  // EXPORT PDF
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
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null)
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setShowOpen] = useState(false)
  const [isExportOpen, setExportOpen] = useState(false)
  const [isExportExcelOpen, setExportExcelOpen] = useState(false)

  const [isCreateLoanOpen, setCreateLoanOpen] = useState(false)
  const [isReceiveOpen, setReceiveOpen] = useState(false)
  const [isCreateMovementOpen, setCreateMovementOpen] = useState(false)
  const [selectedMovementRecordFile, setSelectedMovementRecordFile] =
    useState<RecordFile | null>(null)

  const openCreateMovement = (u: RecordFile) => {
    setSelected(u)
    setCreateMovementOpen(true)
  }

  const closeCreateMovement = () => {
    setSelected(null)
    setCreateMovementOpen(false)
  }
  const openCreateLoan = (u: RecordFile) => {
    setSelected(u)
    setCreateLoanOpen(true)
  }
  const closeCreateLoan = () => {
    setSelected(null)
    setCreateLoanOpen(false)
  }

  const [isReorderOpen, setReorderOpen] = useState(false)

  const openReorder = () => setReorderOpen(true)
  const closeReorder = () => setReorderOpen(false)

  const {
    createMovement,
    loading: loadingCreateMovement,
    error: errorCreateMovement,
  } = useCreateMovement()

  const [isCoverOpen, setCoverOpen] = useState(false)
  const openExportExcel = () => {
    setExportExcelOpen(true)
  }
  const closeExportExcel = () => setExportExcelOpen(false)

  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  const openEdit = (u: RecordFile) => {
    setSelected(u)
    setEditOpen(true)
  }
  const closeEdit = () => {
    setSelected(null)
    setEditOpen(false)
  }

  const openDelete = (u: RecordFile) => {
    setSelected(u)
    setDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelected(null)
    setDeleteOpen(false)
  }

  const openShow = (u: RecordFile) => {
    setSelected(u)
    setShowOpen(true)
  }
  const closeShow = () => {
    setSelected(null)
    setShowOpen(false)
  }

  const openExport = () => setExportOpen(true)
  const closeExport = () => setExportOpen(false)

  const openCover = (u: RecordFile) => {
    setSelected(u)
    setCoverOpen(true)
  }
  const closeCover = () => {
    setSelected(null)
    setCoverOpen(false)
  }

  const openReceive = (u: RecordFile) => {
    setSelected(u)
    setReceiveOpen(true)
  }
  const closeReceive = () => {
    setSelected(null)
    setReceiveOpen(false)
  }
  // ==========================================================
  // CREATE HANDLER
  // ==========================================================
  const handleCreateMovement = async (data: CreateMovementHistory) => {
    if (!selected) return
    try {
      // aseguramos el record_file_id que viene del expediente
      const payload: CreateMovementHistory = {
        ...data,
        record_file_id: selected.id,
      }

      await createMovement(payload)

      toastSuccess({
        id: 801,
        title: 'Movimiento registrado',
        message: 'El movimiento del expediente se registró correctamente.',
      })

      closeCreateMovement()
      await refetch() // refresca expedientes si es necesario
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 802, title: 'Error', message: msg })
      }

      return toastError({
        id: 802,
        title: 'Error',
        message: getApiMessage(err as ApiError),
      })
    }
  }

  const handleCreate = async (data: CreateRecordFile) => {
    try {
      await createRecordFile(data)

      toastSuccess({
        id: 301,
        title: 'Expediente creado',
        message: 'El expediente fue creado correctamente.',
      })

      closeCreate()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        toastError({ id: 302, title: 'Error', message: msg })
        throw err
      }

      toastError({
        id: 302,
        title: 'Error',
        message: getApiMessage(err as ApiError),
      })
      throw err
    }
  }

  // =======================================
  // CREATE HANDLER
  // =======================================
  const handleCreateLoan = async (data: CreateLoan) => {
    try {
      await createLoan(data)
      toastSuccess({
        id: 701,
        title: 'Préstamo creado',
        message: 'El préstamo fue creado correctamente.',
      })

      closeCreateLoan()
      goLoans()
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

  // ==========================================================
  // UPDATE HANDLER
  // ==========================================================
  const handleUpdate = async (data: UpdateRecordFile) => {
    if (!selected) return

    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== '' && v !== null)
    ) as UpdateRecordFile

    try {
      await updateRecordFile(selected.id, payload)

      toastSuccess({
        id: 303,
        title: 'Expediente actualizado',
        message: 'El expediente fue actualizado correctamente.',
      })

      closeEdit()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        toastError({ id: 304, title: 'Error', message: msg })
        throw err
      }

      toastError({
        id: 304,
        title: 'Error',
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

      toastSuccess({
        id: 307,
        title: 'Expediente eliminado',
        message: 'El expediente fue eliminado correctamente.',
      })

      closeDelete()
      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 308, title: 'Error', message: msg })
      }

      toastError({
        id: 308,
        title: 'Error',
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
        title: 'Exportado',
        message: 'El PDF fue generado correctamente.',
      })
      closeExport()
    } catch (err) {
      toastError({
        id: 402,
        title: 'Error al exportar',
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
        title: 'Carátula generada',
        message: 'La carátula del expediente fue generada correctamente.',
      })
      closeCover()
    } catch (err) {
      toastError({
        id: 502,
        title: 'Error al generar carátula',
        message: getApiMessage(err as ApiError),
      })
    }
  }
  const resetFilters = () => {
    // búsqueda global
    setQuery('')

    // filtros directos
    setReferenceCode('')
    setPreviousReferenceCode('')
    setBoxNumber('')
    setFileNumber('')
    setSensitive('all')

    // filtros por nombre
    setFundName('')
    setSectionName('')
    setSeriesName('')
    setLocationName('')
    setDeteriorationName('')
    setTypologyName('')

    // disponibilidad
    setAvailabilityStatus('all')

    // fechas

    setFileDateAfter(null)
    setFileDateBefore(null)

    // orden
    setOrderBy(null)
  }

  const handleReceive = async () => {
    if (!selected) return

    try {
      await receiveLoanRecord(selected.id)

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

  const handleReorderAll = async () => {
    try {
      const res = await reorderRecordFiles()

      toastSuccess({
        id: 901,
        title: 'Reordenamiento completo',
        message:
          res.updated_records > 0
            ? `Se actualizaron ${res.updated_records} expedientes.`
            : 'No fue necesario actualizar expedientes.',
      })

      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 902, title: 'Error', message: msg })
      }

      toastError({
        id: 902,
        title: 'Error al reordenar',
        message: getApiMessage(err as ApiError),
      })
    }
  }
  type ReorderFilters = {
    fund_id?: string
    section_id?: string
    series_id?: number
    box_number?: number
  }

  const handleReorderWithFilters = async (filters: ReorderFilters) => {
    try {
      const res = await reorderRecordFiles(filters)

      toastSuccess({
        id: 903,
        title: 'Reordenamiento aplicado',
        message:
          res.updated_records > 0
            ? `Se actualizaron ${res.updated_records} expedientes.`
            : 'No fue necesario actualizar expedientes.',
      })

      await refetch()
    } catch (err) {
      const msg = getStandarMessageError(err)
      if (msg) {
        if (msg === 'Sesión expirada.') await logout()
        return toastError({ id: 904, title: 'Error', message: msg })
      }

      toastError({
        id: 904,
        title: 'Error al reordenar',
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
        totalItems,
        user_query,
        setUserQuery,

        // búsqueda global
        query,
        queryInput,
        setQuery,

        // filtros directos
        reference_code,
        setReferenceCode,
        previous_reference_code,
        setPreviousReferenceCode,
        file_number,
        setFileNumber,
        box_number,
        setBoxNumber,

        // confidencialidad
        sensitive,
        setSensitive,

        // filtros por nombre
        fund_name,
        setFundName,
        section_name,
        setSectionName,
        series_name,
        setSeriesName,
        location_name,
        setLocationName,
        deterioration_name,
        setDeteriorationName,
        typology_name,
        setTypologyName,

        // disponibilidad
        availability_status,
        setAvailabilityStatus,

        // fechas documentales
        file_date_after,
        setFileDateAfter,
        file_date_before,
        setFileDateBefore,

        // orden
        order_by,
        setOrderBy,

        // paginación
        hasNext,
        hasPrev,
        nextPage,
        prevPage,
        goNext,
        goPrev,

        refetch,

        selected,
        setSelected,
        selectedLoan,
        setSelectedLoan,

        isCreateOpen,
        openCreate,
        closeCreate,
        handleCreate,

        isCreateLoanOpen,
        openCreateLoan,
        closeCreateLoan,
        handleCreateLoan,

        isReceiveOpen,
        openReceive,
        closeReceive,
        handleReceive,

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

        isReorderOpen,
        openReorder,
        closeReorder,
        handleReorderAll,
        handleReorderWithFilters,

        loadingGet,
        loadingCreate,
        loadingUpdate,
        loadingDelete,
        loadingExport,
        loadingPrint,
        loadingCreateLoan,
        loadingReceive,
        loadingReorder,

        errorGet,
        errorCreate,
        errorUpdate,
        errorDelete,
        errorExport,
        errorPrint,
        errorCreateLoan,
        errorReceive,
        errorReorder,

        resetFilters,
        isExportExcelOpen,
        openExportExcel,
        closeExportExcel,

        isCreateMovementOpen,
        openCreateMovement,
        closeCreateMovement,
        handleCreateMovement,
        loadingCreateMovement,
        errorCreateMovement,
      }}
    >
      {children}
    </RecordFilesContext.Provider>
  )
}
