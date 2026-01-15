import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'


import Eye from '@icons/eye.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'

import { useBoxes } from './box-context.js'

import { formatFecha, getEntyityLabel, invertDate } from '@/components/ui/functions'
import { Box } from '@/lib/api/models/box.js'

interface Props {
  item: Box
}
const BoxRow = ({ item:box }: Props) => {
  const { openEdit, openDelete, openShow, openDisable, openEnable } =
    useBoxes()
    const getActive=(s:boolean)=>{
      return s ?'Activa':'Inactiva'
    }

  return (
    <div
      className={`grid grid-cols-[0.4fr_0.4fr_0.4fr_0.2fr]  md:grid-cols-[0.4fr_0.4fr_0.4fr_0.4fr_0.2fr]  text-xs md:text-sm  px-2  rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
        !box.is_active &&
        'bg-light-gray 4 hover:bg-main-gray '
      } `}
    >
      <span className="">{box.box_number}</span>
      <span className="">{box.physical_location?.code || '—'}</span>
      <span className="">{getActive(box.is_active)}</span>
      <span className="">{formatFecha(box.updated_at)}</span>
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
            onClick={() => openShow(box)}
          />
          {!box.is_active ? (
            <OpcionMenu
              icon={<img src={EnableButton} alt="Habilitar" className="w-5" />}
              text='Activar'
              onClick={() => {
                openEnable(box)
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
                openDisable(box)
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
            onClick={() => openEdit(box)}
          />
          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text='Eliminar'
            onClick={() => openDelete(box)}
            className="text-red-500"
          />
          
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default BoxRow
