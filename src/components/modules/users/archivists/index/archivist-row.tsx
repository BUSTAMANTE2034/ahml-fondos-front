import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'


import Eye from '@icons/eye.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'
import Recover from '@icons/user-password.svg'

import { User } from '@lib/api/models/user'
import { useArchivists } from './archivist-context'

import { formatFecha } from '@/components/ui/functions'

interface Props {
  Archivist: User
}
const ArchivistRow = ({ Archivist }: Props) => {
  const { openEdit, openDelete, openShow, openDisable, openEnable,openRecover } =
    useArchivists()
const last_login = formatFecha(Archivist.last_login)

  return (
    <div
      className={`grid grid-cols-[1fr_1fr_1.8fr_0.2fr] text-xs md:text-sm  px-2  md:grid-cols-[1fr_1fr_1fr_1.8fr_1fr_0.2fr]  rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
        !Archivist.is_active &&
        'bg-light-gray 4 hover:bg-main-gray '
      } `}
    >
      <span className="">{Archivist.first_name}</span>
      <span className="hidden lg:block">{Archivist.last_name}</span>
      <span className="">{Archivist.employee_id}</span>
      <span className="text-dark2-gray  underline truncate">
        {Archivist.email}
      </span>
       <span className="hidden md:block text-xs">{last_login||'Sin inicio'}</span>
      <span className="flex Archivists-center ml-auto">
        <MenuDesplegable
          trigger={
            <img
              src={ Menu}
              alt="menu"
              className="cursor-pointer rounded-full h-7 w-7"
            />
          }
        >
          <OpcionMenu
            icon={
              <img
                src={ Eye}
                alt="Ver"
                className="w-5"
              />
            }
            text="Ver"
            onClick={() => openShow(Archivist)}
          />
          {!Archivist.is_active ? (
            <OpcionMenu
              icon={<img src={EnableButton} alt="Habilitar" className="w-5" />}
              text='Activar'
              onClick={() => {
                openEnable(Archivist)
              }}
            />
          ) : (
            <OpcionMenu
              icon={
                <img
                  src={Disable}
                  alt="Deshabilitar"
                  className="w-5"
                />
              }
              text='Desactivar'
              onClick={() => {
                openDisable(Archivist)
              }}
            />
          )}

          <OpcionMenu
            icon={
              <img
                src={Edit}
                alt="Editar"
                className="w-5"
              />
            }
            text='Editar'
            onClick={() => openEdit(Archivist)}
          />
           <OpcionMenu
            icon={
              <img
                src={Recover}
                alt="Restablecer"
                className="w-5"
              />
            }
            text='Restablecer'
            onClick={() => openRecover(Archivist)}
          />
          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text='Eliminar'
            onClick={() => openDelete(Archivist)}
            className="text-red-500"
          />
          
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default ArchivistRow
