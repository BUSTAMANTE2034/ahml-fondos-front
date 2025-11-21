import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { useRecoverPassword } from "@hooks/auth/use-recover-password";

import { User, CreateUser, UpdateUser } from "@models/user";
import {
  useGetUsers,
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@hooks/users";

import {
  ApiError,
  getStandarMessageError,
  getApiMessage,
} from "@/lib/types/errors";

import { useToast, useAuth } from "@contexts/index";

interface ContextValue {
  archivists: User[];
  pages: number | null;
  current_page: number | null;
  total: number | null;

  query: string;
  queryInput: string;
  setQuery: (q: string) => void;

  is_active: boolean | null;
  setIsActive: (a: boolean | null) => void;

  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  goNext: () => void;
  goPrev: () => void;

  getUsers: () => Promise<void>;

  selected: User | null;
  setSelected: (u: User | null) => void;

  // Create
  isCreateOpen: boolean;
  openCreate: () => void;
  closeCreate: () => void;
  handleCreate: (data: CreateUser) => Promise<void>;

  // Edit
  isEditOpen: boolean;
  openEdit: (u: User) => void;
  closeEdit: () => void;
  handleUpdate: (data: UpdateUser) => Promise<void>;

  // Enable / Disable
  isEnableOpen: boolean;
  openEnable: (u: User) => void;
  closeEnable: () => void;

  isDisableOpen: boolean;
  openDisable: (u: User) => void;
  closeDisable: () => void;

  handleEnable: (active: boolean) => Promise<void>;

  // Delete
  isDeleteOpen: boolean;
  openDelete: (u: User) => void;
  closeDelete: () => void;
  handleDelete: () => Promise<void>;

  // Recover password
  isRecoverOpen: boolean;
  openRecover: (u: User) => void;
  closeRecover: () => void;
  handleRecoverPassword: (id: number) => Promise<void>;

  // Show
  isShowOpen: boolean;
  openShow: (u: User) => void;
  closeShow: () => void;

  // Loading
  loadingGet: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  loadingRecover: boolean;

  // Errors
  errorGet: string | null;
  errorCreate: string | null;
  errorUpdate: string | null;
  errorDelete: string | null;
  errorRP: string | null;
}

const ArchivistsContext = createContext<ContextValue | null>(null);

export const useArchivists = () => {
  const ctx = useContext(ArchivistsContext);
  if (!ctx) throw new Error("useArchivists must be inside ArchivistsProvider");
  return ctx;
};

export const ArchivistsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth();
  const { toastSuccess, toastError } = useToast();

  // =========================
  // HOOKS PRINCIPALES
  // =========================

  const {
    users: archivists,
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
    initialRole: "archivist",
    initialIsActive: null,
  });

  const {
    createUser: createArchivist,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateUser();

  const {
    updateUser: updateArchivist,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateUser();

  const {
    deleteUser: deleteArchivist,
    loading: loadingDelete,
    error: errorDelete,
  } = useDeleteUser();

  const {
    recoverPassword,
    loading: loadingRecover,
    error: errorRP,
  } = useRecoverPassword();

  // =========================
  // ESTADOS DE MODALES
  // =========================

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [isEnableOpen, setIsEnableOpen] = useState(false);
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isShowOpen, setIsShowOpen] = useState(false);
  const [isRecoverOpen, setRecoverOpen] = useState(false);

  const [selected, setSelected] = useState<User | null>(null);

  // =========================
  // OPEN/CLOSE
  // =========================

  const openCreate = () => setCreateOpen(true);
  const closeCreate = () => setCreateOpen(false);

  const openEdit = (u: User) => {
    setSelected(u);
    setEditOpen(true);
  };
  const closeEdit = () => {
    setSelected(null);
    setEditOpen(false);
  };

  const openEnable = (u: User) => {
    setSelected(u);
    setIsEnableOpen(true);
  };
  const closeEnable = () => {
    setSelected(null);
    setIsEnableOpen(false);
  };

  const openDisable = (u: User) => {
    setSelected(u);
    setIsDisableOpen(true);
  };
  const closeDisable = () => {
    setSelected(null);
    setIsDisableOpen(false);
  };

  const openDelete = (u: User) => {
    setSelected(u);
    setDeleteOpen(true);
  };
  const closeDelete = () => {
    setSelected(null);
    setDeleteOpen(false);
  };

  const openShow = (u: User) => {
    setSelected(u);
    setIsShowOpen(true);
  };
  const closeShow = () => {
    setSelected(null);
    setIsShowOpen(false);
  };

  const openRecover = (u: User) => {
    setSelected(u);
    setRecoverOpen(true);
  };

  const closeRecover = () => {
    setSelected(null);
    setRecoverOpen(false);
  };

  // =========================
  // HANDLERS
  // =========================

  const handleCreate = async (data: CreateUser) => {
    try {
      await createArchivist(data);
      await getUsers();
      toastSuccess({
        id: 102,
        title: "¡Éxito!",
        message: "Archivista creado correctamente",
      });
      closeCreate();
    } catch (err) {
      const standardMessage = getStandarMessageError(err);
      if (standardMessage) {
        if (standardMessage === "Sesión expirada.") await logout();
        toastError({ id: 103, title: "Error", message: standardMessage });
        return;
      }

      if (err instanceof ApiError) {
        toastError({
          id: 103,
          title: "Error",
          message: getApiMessage(err),
        });
        return;
      }

      toastError({
        id: 103,
        title: "Error",
        message: "Error inesperado al crear Archivista",
      });
    }
  };

  const handleUpdate = async (data: UpdateUser) => {
    if (!selected) return;

    const payload = Object.fromEntries(
      Object.entries(data).filter(
        ([k, v]) => v !== "" && v !== null && v !== undefined
      )
    ) as UpdateUser;

    try {
      await updateArchivist(selected.id, payload);
      await getUsers();
      toastSuccess({
        id: 104,
        title: "¡Éxito!",
        message: "Archivista actualizado correctamente",
      });
      closeEdit();
    } catch (err) {
      const standardMessage = getStandarMessageError(err);
      if (standardMessage) {
        if (standardMessage === "Sesión expirada.") await logout();
        toastError({ id: 105, title: "Error", message: standardMessage });
        return;
      }

      if (err instanceof ApiError) {
        toastError({
          id: 105,
          title: "Error",
          message: getApiMessage(err),
        });
        return;
      }

      toastError({
        id: 105,
        title: "Error",
        message: "Error inesperado.",
      });
    }
  };

  const handleEnable = async (is_active: boolean) => {
    if (!selected) return;

    try {
      await updateArchivist(
        selected.id,
        { is_active } as Partial<UpdateUser>
      );
      await getUsers();

      toastSuccess({
        id: 108,
        title: "¡Éxito!",
        message: is_active
          ? "Archivista habilitado correctamente"
          : "Archivista deshabilitado correctamente",
      });

      closeEnable();
      closeDisable();
    } catch (err) {
      const standardMessage = getStandarMessageError(err);
      if (standardMessage) {
        if (standardMessage === "Sesión expirada.") await logout();
        toastError({ id: 109, title: "Error", message: standardMessage });
        return;
      }

      if (err instanceof ApiError) {
        toastError({
          id: 109,
          title: "Error",
          message: getApiMessage(err),
        });
        return;
      }

      toastError({
        id: 109,
        title: "Error",
        message: "Error inesperado.",
      });
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    try {
      await deleteArchivist(selected.id);
      await getUsers();

      toastSuccess({
        id: 106,
        title: "¡Éxito!",
        message: "Archivista eliminado correctamente",
      });

      closeDelete();
    } catch (err) {
      const standardMessage = getStandarMessageError(err);
      if (standardMessage) {
        if (standardMessage === "Sesión expirada.") await logout();
        toastError({ id: 107, title: "Error", message: standardMessage });
        return;
      }

      if (err instanceof ApiError) {
        toastError({
          id: 107,
          title: "Error",
          message: getApiMessage(err),
        });
        return;
      }

      toastError({
        id: 107,
        title: "Error",
        message: "Error inesperado al eliminar Archivista",
      });
    }
  };

  const handleRecoverPassword = async (user_id: number) => {
    try {
      const ok = await recoverPassword({ user_id });

      await getUsers();

      if (ok) {
        toastSuccess({
          id: 110,
          title: "¡Contraseña regenerada!",
          message: "La nueva contraseña temporal fue enviada al correo.",
        });
      }

      closeRecover();
    } catch (err) {
      const standardMessage = getStandarMessageError(err);

      if (standardMessage) {
        if (standardMessage === "Sesión expirada.") await logout();

        toastError({
          id: 111,
          title: "Error",
          message: standardMessage,
        });

        return;
      }

      if (err instanceof ApiError) {
        toastError({
          id: 111,
          title: "Error",
          message: getApiMessage(err),
        });

        return;
      }

      toastError({
        id: 111,
        title: "Error",
        message: "Error inesperado al recuperar contraseña",
      });
    }
  };

  return (
    <ArchivistsContext.Provider
      value={{
        archivists,
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
    </ArchivistsContext.Provider>
  );
};
