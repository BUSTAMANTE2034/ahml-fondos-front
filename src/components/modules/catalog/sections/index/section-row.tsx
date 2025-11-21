import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'


import Eye from '@icons/eye.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'

import { useSections } from './section-context.js'

import { formatFecha, getEntyityLabel, invertDate } from '@/components/ui/functions'
import { Section } from '@/lib/api/models/section.js'

interface Props {
  item: Section
}
const SectionRow = ({ item:section }: Props) => {
  const { openEdit, openDelete, openShow, openDisable, openEnable } =
    useSections()

  return (
    <div
      className={`grid grid-cols-[1.6fr_0.6fr_0.6fr_0.2fr]  md:grid-cols-[0.4fr_1.8fr_0.4fr_0.8fr_0.8fr_0.2fr] text-xs md:text-sm  px-2  rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
        !section.is_active &&
        'bg-light-gray 4 hover:bg-main-gray '
      } `}
    >
      <span className="hidden lg:block">{section.catalog_key?.key}</span>
      <span className="">{section.name}</span>
      <span className="hidden lg:block">{section.acronym}</span>
       <span className=" text-xs">{invertDate(section.start_date)}</span>
       <span className="text-xs">{invertDate(section.end_date)}</span>
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
            onClick={() => openShow(section)}
          />
          {!section.is_active ? (
            <OpcionMenu
              icon={<img src={EnableButton} alt="Habilitar" className="w-5" />}
              text='Activar'
              onClick={() => {
                openEnable(section)
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
                openDisable(section)
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
            onClick={() => openEdit(section)}
          />
          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text='Eliminar'
            onClick={() => openDelete(section)}
            className="text-red-500"
          />
          
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default SectionRow
