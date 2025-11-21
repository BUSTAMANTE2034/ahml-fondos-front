import { useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User } from '@lib/api/models/user'
import Settings from '@icons/settings.svg'
import SettingsW from '@icons/settingsW.svg'
import Output from '@icons/output.svg'
import OutputW from '@icons/outputW.svg'
import { useLogout } from '@contexts/logoutContext'
import { useChangePasswordModal } from '@contexts/changePasswordContext'
import ChangePasswordModal from './change-password-modal'
interface UserMenuProps {
  user: User
  onClose: () => void
  onOpenConfig: () => void
}

const userMenu = ({ user, onClose, onOpenConfig }: UserMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { openLogoutModal } = useLogout()
  const { openCPModal } = useChangePasswordModal();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])
  const types = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'manager':
        return 'Gestor'
      case 'archivist':
        return 'Archivista'
      case 'visitor':
        return 'Visitante'
    }
  }
  const formatFecha = (isoString: string) => {
  const date = new Date(isoString)

  const day = date.getDate().toString().padStart(2, '0')
  const monthIndex = date.getMonth() // 0-11
  const year = date.getFullYear()

  const meses = [
    'ene', 'feb', 'mar', 'abr', 'may', 'jun',
    'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
  ]

  let hours = date.getHours()
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = hours >= 12 ? 'p.m.' : 'a.m.'

  hours = hours % 12
  if (hours === 0) hours = 12 // 0 -> 12

  return `${day}-${meses[monthIndex]}-${year} (${hours}:${minutes}${ampm})`
}
const last_login = formatFecha(user.last_login)



  return (
    <div
      ref={menuRef}
      className="p-2 px-4 absolute right-10 top-10 rounded-2xl mt-2 w-50 md:w-60  bg-gray-0 border border-gray-2 shadow-sm shadow-gray-2  z-50"
      aria-label="Menú de usuario"
    >
      {/* Información de Usuario */}
      <div className="border-b-2  border-gray-2 pb-1 mb-1">
        <p className="font-semibold text-tblack text-sm">{user.first_name}</p>
        {user.role && (
          <>
            {' '}
            <p className="text-[10px] md:text-xs text-dark2-gray ">
              {types(user.role)}
            </p>
            <p>
              <span className="text-[10px] text-dark2-gray ">
                {user.employee_id}{' '}|{' '}
                <span className="text-[10px]  text-dark2-gray ">
                  {last_login}
                </span>
              </span>
            </p>
          </>
        )}
      </div>
      <ul className="py-1 flex flex-col gap-1">
        {/*Configuración */}
        <li
          onClick={() => {
             openCPModal();   // ahora abre el modal
    onClose();
          }}
          className="flex flex-row  hover:bg-dark-gray  active:bg-gray-1 hover:border border-dark-gray  rounded-2xl w-full text-left gap-4 px-2 py-2  cursor-pointer items-center"
        >
          <img
            src={Settings}
            alt="Cambiar contraseña"
            className="w-4 h-4 md:w-6 md:h-6"
          />
          <span className="text-xs">Cambiar contraseña</span>
          <button></button>
        </li>
        {/*Cerrar Sesión */}
        <li
          onClick={() => {
            openLogoutModal()
          }}
          className="flex flex-row  hover:bg-dark-gray  active:bg-gray-1 hover:border border-dark-gray  rounded-2xl w-full text-left gap-4 px-2 py-2  cursor-pointer items-center"
        >
          <img src={Output} alt="Logout" className="w-4 h-4 md:w-6 md:h-6" />
          <span className="text-xs">Cerrar Sesión</span>
        </li>
      </ul>
            

    </div>
  )
}

export default userMenu
