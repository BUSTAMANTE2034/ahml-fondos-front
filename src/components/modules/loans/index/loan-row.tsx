import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'
import Recibe from '@icons/loan.svg'
import Eye from '@icons/eye.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'

import { useLoans } from './loan-context.js'

import {
  formatFecha,
  getEntyityLabel,
  invertDate,
  getAvailabilityLabel,
} from '@/components/ui/functions'
import { Loan } from '@/lib/api/models/loan.js'

interface Props {
  item: Loan
}
const LoanRow = ({ item: loan }: Props) => {
  const { openEdit, openDelete, openShow, openReceive } = useLoans()

  return (
    <div
      className={`grid grid-cols-[0.6fr_0.6fr_0.6fr_0.2fr]  md:grid-cols-[0.6fr_0.6fr_0.4fr_0.6fr_0.4fr_0.2fr] text-xs md:text-sm  px-2  rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
      loan.is_active && 'bg-yellow-300 hover:bg-yellow-200 '
    } `}
    >
      <span className=" text-xs">
        {loan.record_file?.reference_code}
      </span>
      <span className=" hidden lg:block text-xs">{loan.issued_by_user?.email}</span>
      <span className=" text-xs">{formatFecha(loan.loaded_at)}</span>
      <span className="hidden lg:block text-xs">{loan.loaded_by_user?.email}</span>

      <span className="text-xs">{formatFecha(loan.returned_at)}</span>
      <span className="flex items-center ml-auto">
        <MenuDesplegable
          trigger={
            <img
              src={Menu}
              alt="menu"
              className="cursor-pointer rounded-full h-7 w-7"
            />
          }
        >
          <OpcionMenu
            icon={<img src={Eye} alt="Ver" className="w-5" />}
            text="Ver"
            onClick={() => openShow(loan)}
          />
          {loan.is_active &&(
            <OpcionMenu
              icon={<img src={Recibe} alt="Recibir" className="w-5" />}
              text="Recibir"
              onClick={() => {
                openReceive(loan)
              }}
            />
          )}
           <OpcionMenu
              icon={<img src={Edit} alt="Editar" className="w-5" />}
              text="Editar"
              onClick={() => {
                openEdit(loan)
              }}
            />

          {/* <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text="Eliminar"
            onClick={() => openDelete(loan)}
            className="text-red-500"
          /> */}
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default LoanRow
