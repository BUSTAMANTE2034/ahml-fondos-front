import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'
import Eye from '@icons/eye.svg'

import { useMovements } from './movement-context.js'

import { formatFecha, getAvailabilityLabel } from '@/components/ui/functions'
import { MovementHistory } from '@/lib/api/models/movement.js'

interface Props {
  item: MovementHistory
}

const MovementRow = ({ item: movement }: Props) => {
  const { openEdit, openDelete, openShow } = useMovements()

  return (
    <div
      className={`
        grid grid-cols-[0.7fr_0.6fr_0.6fr_0.6fr_0.2fr]
        md:grid-cols-[0.6fr_0.6fr_0.4fr_0.4fr_0.4fr_0.2fr]
        text-xs md:text-sm px-2 rounded-2xl w-full items-center 
        text-left hover:bg-main-gray
      `}
    >
      {/* Reference code */}
      <span className="text-xs">
        {movement.record_file?.reference_code ?? '—'}
      </span>

      {/* Origin Status */}
      <span className="hidden md:block text-xs capitalize">
        {getAvailabilityLabel(movement.origin_status||'available')?? '—'}
      </span>

      {/* Destination Status */}
      <span className="text-xs capitalize">
        {getAvailabilityLabel(movement.destination_status||'available')}
      </span>

      {/* Moved at */}
      <span className="text-xs">
        {formatFecha(movement.moved_at)}
      </span>

      {/* User */}
      <span className="hidden lg:block text-xs">
        {movement.moved_by_user
          ? `${movement.moved_by_user.first_name} ${movement.moved_by_user.last_name}`
          : '—'}
      </span>

      {/* Actions */}
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
            onClick={() => openShow(movement)}
          />

          <OpcionMenu
            icon={<img src={Edit} alt="Editar" className="w-5" />}
            text="Editar"
            onClick={() => openEdit(movement)}
          />

          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text="Eliminar"
            onClick={() => openDelete(movement)}
            className="text-red-500"
          />
        </MenuDesplegable>
      </span>
    </div>
  )
}

export default MovementRow
