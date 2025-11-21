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
  visitors: User[];
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

  // Error
  errorGet: string | null;
  errorCreate: string | null;
  errorUpdate: string | null;
  errorDelete: string | null;
  errorRP: string | null;
}

const VisitorsContext = createContext<ContextValue | null>(null);

export const useVisitors = () => {
  const ctx = useContext(VisitorsContext);
  if (!ctx) throw new Error("useVisitors must be inside VisitorsProvider");
  return ctx;
};

export const VisitorsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth();
  const { toastSuccess, toastError } = useToast();

  // =========================
  // HOOKS PRINCIPALES
  // =========================

  const {
    users: visitors,
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
    initialRole: "visitor",
    initialIsActive: null,
  });

  const {
    createUser: createVisitor,
    loading: loadingCreate,
    error: errorCreate,
  } = useCreateUser();

  const {
    updateUser: updateVisitor,
    loading: loadingUpdate,
    error: errorUpdate,
  } = useUpdateUser();

  const {
    deleteUser: deleteVisitor,
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
  // OPEN/CLOSE functions
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
  // HANDLERS async
  // =========================

  const handleCreate = async (data: CreateUser) => {
    try {
      await createVisitor(data);
      await getUsers();

      toastSuccess({
        id: 102,
        title: "¡Éxito!",
        message: "Visitante creado correctamente",
      });

      closeCreate();
    } catch (err) {
      const msg = getStandarMessageError(err);
      if (msg) {
        if (msg === "Sesión expirada.") await logout();
        toastError({ id: 103, title: "Error", message: msg });
        return;
      }

      toastError({
        id: 103,
        title: "Error",
        message: err instanceof ApiError ? getApiMessage(err) : "Error inesperado",
      });
    }
  };

  const handleUpdate = async (data: UpdateUser) => {
    if (!selected) return;

    const payload = Object.fromEntries(
      Object.entries(data).filter(
        ([key, value]) => value !== "" && value !== null && value !== undefined
      )
    ) as UpdateUser;

    try {
      await updateVisitor(selected.id, payload);
      await getUsers();

      toastSuccess({
        id: 104,
        title: "¡Éxito!",
        message: "Visitante actualizado correctamente",
      });

      closeEdit();
    } catch (err) {
      const msg = getStandarMessageError(err);
      if (msg) {
        if (msg === "Sesión expirada.") await logout();
        toastError({ id: 105, title: "Error", message: msg });
        return;
      }

      toastError({
        id: 105,
        title: "Error",
        message: err instanceof ApiError ? getApiMessage(err) : "Error inesperado",
      });
    }
  };

  const handleEnable = async (active: boolean) => {
    if (!selected) return;

    try {
      await updateVisitor(selected.id, { is_active: active });
      await getUsers();

      toastSuccess({
        id: 108,
        title: "¡Éxito!",
        message: active
          ? "Visitante habilitado correctamente"
          : "Visitante deshabilitado correctamente",
      });

      closeEnable();
      closeDisable();
    } catch (err) {
      const msg = getStandarMessageError(err);
      if (msg) {
        if (msg === "Sesión expirada.") await logout();
        toastError({ id: 109, title: "Error", message: msg });
        return;
      }

      toastError({
        id: 109,
        title: "Error",
        message: err instanceof ApiError ? getApiMessage(err) : "Error inesperado",
      });
    }
  };

  const handleDelete = async () => {
    if (!selected) return;

    try {
      await deleteVisitor(selected.id);
      await getUsers();

      toastSuccess({
        id: 106,
        title: "¡Éxito!",
        message: "Visitante eliminado correctamente",
      });

      closeDelete();
    } catch (err) {
      const msg = getStandarMessageError(err);
      if (msg) {
        if (msg === "Sesión expirada.") await logout();
        toastError({ id: 107, title: "Error", message: msg });
        return;
      }

      toastError({
        id: 107,
        title: "Error",
        message: err instanceof ApiError ? getApiMessage(err) : "Error inesperado",
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
          message:
            "Se envió la contraseña temporal al correo del usuario.",
        });
      }

      closeRecover();
    } catch (err) {
      const msg = getStandarMessageError(err);

      if (msg) {
        if (msg === "Sesión expirada.") await logout();
        toastError({ id: 111, title: "Error", message: msg });
        return;
      }

      toastError({
        id: 111,
        title: "Error",
        message: err instanceof ApiError ? getApiMessage(err) : "Error inesperado al recuperar contraseña",
      });
    }
  };

  // =========================
  // RETURN PROVIDER
  // =========================

  return (
    <VisitorsContext.Provider
      value={{
        visitors,
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
    </VisitorsContext.Provider>
  );
};
