import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'


import Eye from '@icons/eye.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'

import { useDeteriorations } from './deterioration-context.js'

import { formatFecha, getEntyityLabel, invertDate } from '@/components/ui/functions'
import { Deterioration } from '@/lib/api/models/deterioration.js'

interface Props {
  item: Deterioration
}
const DeteriorationRow = ({ item:deterioration }: Props) => {
  const { openEdit, openDelete, openShow, openDisable, openEnable } =
    useDeteriorations()

  return (
    <div
      className={`grid grid-cols-[1.4fr_3fr_0.2fr]  md:grid-cols-[1.4fr_3fr_0.2fr]  text-xs md:text-sm  px-2  rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
        !deterioration.is_active &&
        'bg-light-gray 4 hover:bg-main-gray '
      } `}
    >
      <span className="">{deterioration.name}</span>
      <span className="">{deterioration.description}</span>
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
            onClick={() => openShow(deterioration)}
          />
          {!deterioration.is_active ? (
            <OpcionMenu
              icon={<img src={EnableButton} alt="Habilitar" className="w-5" />}
              text='Activar'
              onClick={() => {
                openEnable(deterioration)
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
                openDisable(deterioration)
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
            onClick={() => openEdit(deterioration)}
          />
          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text='Eliminar'
            onClick={() => openDelete(deterioration)}
            className="text-red-500"
          />
          
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default DeteriorationRow
