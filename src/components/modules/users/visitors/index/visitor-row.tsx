import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'
import Recover from '@icons/user-password.svg'


import Eye from '@icons/eye.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'

import { User } from '@lib/api/models/user'
import { useVisitors } from './visitor-context'

import { formatFecha } from '@/components/ui/functions'

interface Props {
  visitor: User
}
const VisitorRow = ({ visitor }: Props) => {
  const { openEdit, openDelete, openShow, openDisable, openEnable,openRecover} =
    useVisitors()
const last_login = formatFecha(visitor.last_login)

  return (
    <div
      className={`grid grid-cols-[1fr_1fr_1.8fr_0.2fr] text-xs md:text-sm  px-2  md:grid-cols-[1fr_1fr_1fr_1.8fr_1fr_0.2fr]  rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
        !visitor.is_active &&
        'bg-light-gray 4 hover:bg-main-gray '
      } `}
    >
      <span className="">{visitor.first_name}</span>
      <span className="hidden lg:block">{visitor.last_name}</span>
      <span className="">{visitor.employee_id}</span>
      <span className="text-dark2-gray  underline truncate">
        {visitor.email}
      </span>
       <span className="hidden md:block text-xs">{last_login||'Sin inicio'}</span>
      <span className="flex items-center ml-auto">
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
            onClick={() => openShow(visitor)}
          />
          {!visitor.is_active ? (
            <OpcionMenu
              icon={<img src={EnableButton} alt="Habilitar" className="w-5" />}
              text='Activar'
              onClick={() => {
                openEnable(visitor)
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
                openDisable(visitor)
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
            onClick={() => openEdit(visitor)}
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
            onClick={() => openRecover(visitor)}
          />
          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text='Eliminar'
            onClick={() => openDelete(visitor)}
            className="text-red-500"
          />
          
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default VisitorRow
