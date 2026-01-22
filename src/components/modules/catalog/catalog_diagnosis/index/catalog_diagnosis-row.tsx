import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'


import Eye from '@icons/eye.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'

import { useDiagnosisCatalog } from './catalog_diagnosis-context.js'

import { formatFecha, getEntyityLabel, invertDate } from '@/components/ui/functions'
import { DiagnosisCatalog } from '@/lib/api/models/diagnosis_catalog.js'

interface Props {
  item: DiagnosisCatalog
}
const DiagnosisCatalogRow = ({ item:diagnosisCatalog }: Props) => {
  const { openEdit, openDelete, openShow, openDisable, openEnable } =
    useDiagnosisCatalog()

  return (
    <div
      className={`grid grid-cols-[0.6fr_0.6fr_1.6fr_0.2fr]  md:grid-cols-[0.4fr_0.8fr_1.8fr_0.6fr_0.2fr] text-xs md:text-sm  px-2  rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
        !diagnosisCatalog.is_active &&
        'bg-light-gray 4 hover:bg-main-gray '
      } `}
    >
      <span className="hidden lg:block">{diagnosisCatalog.concept}</span>
      <span className="">{diagnosisCatalog.detail}</span>
      <span className="hidden lg:block">{diagnosisCatalog.description||'Sin descripción'}</span>
       <span className="text-xs">{formatFecha(diagnosisCatalog.updated_at)}</span>
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
            onClick={() => openShow(diagnosisCatalog)}
          />
          {!diagnosisCatalog.is_active ? (
            <OpcionMenu
              icon={<img src={EnableButton} alt="Habilitar" className="w-5" />}
              text='Activar'
              onClick={() => {
                openEnable(diagnosisCatalog)
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
                openDisable(diagnosisCatalog)
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
            onClick={() => openEdit(diagnosisCatalog)}
          />
          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text='Eliminar'
            onClick={() => openDelete(diagnosisCatalog)}
            className="text-red-500"
          />
          
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default DiagnosisCatalogRow
