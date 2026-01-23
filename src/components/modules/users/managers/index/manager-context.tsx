import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useRecoverPassword } from '@hooks/auth/use-recover-password'

import { User, CreateUser, UpdateUser } from '@models/user'
import {
  useGetUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from '@hooks/users'
import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from '@/lib/types/errors'
import { useToast, useAuth } from '@contexts/index'

interface ContextValue {
  managers: User[]
  pages: number | null
  current_page: number | null
  total: number 

  // Filtro texto
  query: string
  queryInput: string
  setQuery: (q: string) => void

  // Filtro activo
  is_active: boolean | null
  setIsActive: (a: boolean | null) => void

  // Paginación
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
  goNext: () => void
  goPrev: () => void

  // Refetch
  getUsers: () => Promise<void>

  // Selección
  selected: User | null
  setSelected: (u: User | null) => void

  // Create
  isCreateOpen: boolean
  openCreate: () => void
  closeCreate: () => void
  handleCreate: (data: CreateUser) => Promise<void>

  // Edit
  isEditOpen: boolean
  openEdit: (u: User) => void
  closeEdit: () => void
  handleUpdate: (data: UpdateUser) => Promise<void>

  // Enable / Disable
  isEnableOpen: boolean
  openEnable: (u: User) => void
  closeEnable: () => void
  isDisableOpen: boolean
  openDisable: (u: User) => void
  closeDisable: () => void
  handleEnable: (active: boolean) => Promise<void>

  // Delete
  isDeleteOpen: boolean
  openDelete: (u: User) => void
  closeDelete: () => void
  handleDelete: () => Promise<void>

  // Recover password
  isRecoverOpen: boolean
  openRecover: (u: User) => void
  closeRecover: () => void
  handleRecoverPassword: (id: number) => Promise<void>

  // Show
  isShowOpen: boolean
  openShow: (u: User) => void
  closeShow: () => void

  // Loading
  loadingGet: boolean
  loadingCreate: boolean
  loadingUpdate: boolean
  loadingDelete: boolean
  loadingRecover: boolean

  // Error (por si quieres usarlos en UI)
  errorGet: string | null
  errorCreate: string | null
  errorUpdate: string | null
  errorDelete: string | null
  errorRP: string | null
}

const ManagersContext = createContext<ContextValue | null>(null)

export const useManagers = () => {
  const ctx = useContext(ManagersContext)
  if (!ctx) throw new Error('useManagers must be inside ManagersProvider')
  return ctx
}

export const ManagersProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth()
  const { toastSuccess, toastError } = useToast()

  // =========================
  // HOOKS / ESTADOS PRINCIPALES
  // =========================
  const {
    users: managers,
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

    hasNext,
    hasPrev,
    nextPage,
    prevPage,
    goNext,
    goPrev,

    getUsers,
  } = useGetUsers({
    initialPage: 1,
    initialPerPage: 20,
    initialRole: 'manager',
    initialIsActive: null,
  })

  const {
    createUser: createManager,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateUser()

  const {
    updateUser: updateManager,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateUser()

  const {
    deleteUser: deleteManager,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteUser()

  const {
    recoverPassword,
    loading: loadingRecover,
    error: errorRP,
    message: messageRP,
  } = useRecoverPassword()

  // Modales y selección
  const [isCreateOpen, setCreateOpen] = useState(false)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isEnableOpen, setIsEnableOpen] = useState(false)
  const [isDisableOpen, setIsDisableOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)
  const [isShowOpen, setIsShowOpen] = useState(false)
  const [selected, setSelected] = useState<User | null>(null)
  const [isRecoverOpen, setRecoverOpen] = useState(false)

  // =========================
  // FUNCIONES (open / close)
  // =========================
  // Create
  const openCreate = () => setCreateOpen(true)
  const closeCreate = () => setCreateOpen(false)

  // Edit
  const openEdit = (user: User) => {
    setSelected(user)
    setEditOpen(true)
  }
  const closeEdit = () => {
    setSelected(null)
    setEditOpen(false)
  }

  // Enable
  const openEnable = (user: User) => {
    setSelected(user)
    setIsEnableOpen(true)
  }
  const closeEnable = () => {
    setSelected(null)
    setIsEnableOpen(false)
  }

  // Disable
  const openDisable = (user: User) => {
    setSelected(user)
    setIsDisableOpen(true)
  }
  const closeDisable = () => {
    setSelected(null)
    setIsDisableOpen(false)
  }

  // Delete
  const openDelete = (user: User) => {
    setSelected(user)
    setDeleteOpen(true)
  }
  const closeDelete = () => {
    setSelected(null)
    setDeleteOpen(false)
  }

  // Show
  const openShow = (user: User) => {
    setSelected(user)
    setIsShowOpen(true)
  }
  const closeShow = () => {
    setSelected(null)
    setIsShowOpen(false)
  }

  // =========================
  // HANDLERS (async)
  // =========================

  // Crear Manager
  const handleCreate = async (data: CreateUser) => {
    try {
      await createManager(data)
      toastSuccess({
        id: 102,
        title: '¡Éxito!',
        message: 'Gestor creado correctamente',
      })
      closeCreate()
      await getUsers()
    } catch (err) {
      const standardMessage = getStandarMessageError(err)
      if (standardMessage) {
        if (standardMessage === 'Sesión expirada.') {
          await logout()
        }
        toastError({ id: 103, title: 'Error', message: standardMessage })
        return
      }

      if (err instanceof ApiError) {
        const backendMsg = getApiMessage(err)
        toastError({ id: 103, title: 'Error', message: backendMsg })
        return
      }

      toastError({
        id: 103,
        title: 'Error',
        message: 'Error inesperado al crear Gestor',
      })
    }
  }

  // Actualizar Manager
  const handleUpdate = async (data: UpdateUser) => {
    if (!selected) return
    const payload: UpdateUser = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => {
        // No incluir campos vacíos ni strings vacíos
        return value !== '' && value !== null && value !== undefined
      })
    ) as UpdateUser
    try {
      await updateManager(selected.id, payload)
      toastSuccess({
        id: 104,
        title: '¡Éxito!',
        message: 'Gestor actualizado correctamente',
      })
      closeEdit()
      await getUsers()
    } catch (err) {
      const standardMessage = getStandarMessageError(err)
      if (standardMessage) {
        if (standardMessage === 'Sesión expirada.') {
          await logout()
        }
        toastError({ id: 105, title: 'Error', message: standardMessage })
        return
      }

      if (err instanceof ApiError) {
        const backendMsg = getApiMessage(err)
        toastError({ id: 105, title: 'Error', message: backendMsg })
        return
      }

      toastError({ id: 105, title: 'Error', message: 'Error inesperado.' })
    }
  }

  // Habilitar / deshabilitar Manager
  const handleEnable = async (is_active: boolean) => {
    if (!selected) return

    try {
      await updateManager(selected.id, { is_active } as Partial<UpdateUser>)
      toastSuccess({
        id: 108,
        title: '¡Éxito!',
        message: is_active
          ? 'Gestor habilitado correctamente'
          : 'Gestor deshabilitado correctamente',
      })
      setSelected(null)
      setIsEnableOpen(false)
      setIsDisableOpen(false)
      await getUsers()
    } catch (err) {
      const standardMessage = getStandarMessageError(err)
      if (standardMessage) {
        if (standardMessage === 'Sesión expirada.') {
          await logout()
        }
        toastError({ id: 109, title: 'Error', message: standardMessage })
        return
      }

      if (err instanceof ApiError) {
        const backendMsg = getApiMessage(err)
        toastError({ id: 109, title: 'Error', message: backendMsg })
        return
      }
      toastError({ id: 109, title: 'Error', message: 'Error inesperado.' })
    }
  }

  // Eliminar Manager
  const handleDelete = async () => {
    if (!selected) return

    try {
      await deleteManager(selected.id)
      toastSuccess({
        id: 106,
        title: '¡Éxito!',
        message: 'Gestor eliminado correctamente',
      })
      closeDelete()
      await getUsers()
    } catch (err) {
      const standardMessage = getStandarMessageError(err)
      if (standardMessage) {
        if (standardMessage === 'Sesión expirada.') {
          await logout()
        }
        toastError({ id: 107, title: 'Error', message: standardMessage })
        return
      }

      if (err instanceof ApiError) {
        const backendMsg = getApiMessage(err)
        toastError({ id: 107, title: 'Error', message: backendMsg })
        return
      }
      toastError({
        id: 107,
        title: 'Error',
        message: 'Error inesperado al eliminar Gestor',
      })
    }
  }
  const openRecover = (u: User) => {
    setSelected(u)
    setRecoverOpen(true)
  }

  const closeRecover = () => {
    setSelected(null)
    setRecoverOpen(false)
  }

  const handleRecoverPassword = async (user_id: number) => {
    try {
      const ok = await recoverPassword({ user_id })

      if (ok) {
        toastSuccess({
          id: 110,
          title: '¡Contraseña regenerada!',
          message: 'Se envió la contraseña temporal al correo del usuario.',
        })
      }

      closeRecover()
      await getUsers()
    } catch (err) {
      const standardMessage = getStandarMessageError(err)
      if (standardMessage) {
        if (standardMessage === 'Sesión expirada.') await logout()
        toastError({ id: 111, title: 'Error', message: standardMessage })
        return
      }

      if (err instanceof ApiError) {
        toastError({
          id: 111,
          title: 'Error',
          message: getApiMessage(err),
        })
        return
      }

      toastError({
        id: 111,
        title: 'Error',
        message: 'Error inesperado al recuperar contraseña',
      })
    } finally {
    }
  }

  return (
    <ManagersContext.Provider
      value={{
        managers,
        pages,
        current_page,
        total,

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
        getUsers,

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

        isRecoverOpen,
        openRecover,
        closeRecover,
        handleRecoverPassword,

        isShowOpen,
        openShow,
        closeShow,

        loadingGet,
        loadingCreate,
        loadingUpdate,
        loadingDelete,
        loadingRecover,

        errorGet,
        errorCreate,
        errorUpdate,
        errorDelete,
        errorRP,
      }}
    >
      {children}
    </ManagersContext.Provider>
  )
}
