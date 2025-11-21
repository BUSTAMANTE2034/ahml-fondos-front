import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'


import Eye from '@icons/eye.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'

import { useKeys } from './key-context'

import { getEntyityLabel } from '@/components/ui/functions'
import { Catalog_Key } from '@/lib/api/models/catalog-key'

interface Props {
  item: Catalog_Key
}
const KeyRow = ({ item:key }: Props) => {
  const { openEdit, openDelete, openShow, openDisable, openEnable } =
    useKeys()

  return (
    <div
      className={`grid grid-cols-[1.8fr_0.4fr_0.2fr] text-xs md:text-sm  px-2  md:grid-cols-[2fr_0.4fr_0.4fr_0.2fr]  rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
        !key.is_active &&
        'bg-light-gray 4 hover:bg-main-gray '
      } `}
    >
      <span className="">{key.name}</span>
      <span className="hidden lg:block">{key.key}</span>
      <span className="">{getEntyityLabel(key.entity_type)}</span>
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
            onClick={() => openShow(key)}
          />
          {!key.is_active ? (
            <OpcionMenu
              icon={<img src={EnableButton} alt="Habilitar" className="w-5" />}
              text='Activar'
              onClick={() => {
                openEnable(key)
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
                openDisable(key)
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
            onClick={() => openEdit(key)}
          />
          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text='Eliminar'
            onClick={() => openDelete(key)}
            className="text-red-500"
          />
          
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default KeyRow
