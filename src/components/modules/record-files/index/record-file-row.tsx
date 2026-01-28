import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'

import Loan from '@icons/loan.svg'
import Receive from '@icons/loan.svg'
import Movement from '@icons/movements.svg'
import Eye from '@icons/eye.svg'
import Download from '@icons/download.svg'

import Disable from '@icons/inactiveB.svg'
import EnableButton from '@icons/activeBr.svg'
import { useLocation, useNavigate } from 'react-router-dom'

import Revision from '@icons/revision3.svg'

import { useRecordFiles } from './record-file-context.js'

import {
  formatFecha,
  getAvailabilityLabel,
  getEntyityLabel,
  invertDate,
  recordFileGrid,
} from '@/components/ui/functions'
import { RecordFile } from '@/lib/api/models/record-file.js'

interface Props {
  item: RecordFile
}
const RecordFilesRow = ({ item: recordFile }: Props) => {
  const {
    openEdit,
    openDelete,
    openShow,
    openCover,
    openCreateLoan,
    openReceive,
    openCreateMovement,
  } = useRecordFiles()

  const navigate = useNavigate()
  const location = useLocation()
  const basePath = location.pathname.split('/record-files')[0]

  return (
    <div
      className={`${recordFileGrid} text-xs md:text-sm  px-2   rounded-2xl   
    w-full items-center  text-left hover:bg-main-gray  ${
      recordFile.availability_status === 'on_loan' &&
      'bg-yellow-200  hover:bg-yellow-100 '
    } ${
      recordFile.availability_status === 'under_review' &&
      'bg-orange-400  hover:bg-orange-300 text-white'
    } ${
      recordFile.availability_status === 'unavailable' &&
      'bg-red-600  hover:bg-red-500  text-white'
    } `}
    >
      {/* Código */}
      <span className="text-xs text-left">{recordFile.reference_code}</span>

      {/* Exp. */}
      <span className="text-xs font-medium text-left hidden md:block  ">
       {recordFile.file_number}
      </span>

      {/* Caja */}
      <span className="text-xs text-left hidden md:block">
      {recordFile.box?.box_number}
      </span>

      {/* Fondo */}
      <span className="text-xs text-left hidden md:block">
        {recordFile.fund?.acronym}
      </span>

      {/* Sección */}
      <span className="text-xs text-left hidden md:block">
        {recordFile.section?.acronym}
      </span>

      {/* Serie */}
      <span className="text-xs text-left hidden md:block">
        {recordFile.series?.acronym}
      </span>

      {/* Sensible / Normal */}
      <span className="text-xs text-left hidden lg:block ">
          {recordFile.sensitive_data ? 'Delicado' : 'Normal'}
      </span>

      {/* Estatus */}
      <span className="text-xs text-left">
        {getAvailabilityLabel(recordFile.availability_status)}
      </span>

      {/* Fecha */}
      <span className="text-xs">{invertDate(recordFile.file_date)}</span>

      {/* Localidad */}
      <span className="text-xs text-left hidden lg:block truncate min-w-0">
        {recordFile.location?.name}
      </span>

      {/* Usuario */}
      <span className="text-xs text-left hidden md:block">
        {recordFile.user?.first_name}
      </span>

      <span className="flex items-center ml-auto">
        <MenuDesplegable
          className="text-black"
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
            onClick={() => openShow(recordFile)}
          />

          <OpcionMenu
            icon={<img src={Edit} alt="Editar" className="w-5" />}
            text="Editar"
            onClick={() => openEdit(recordFile)}
          />
          <OpcionMenu
            icon={<img src={Download} alt="Carátula" className="w-5" />}
            text="Carátula"
            onClick={() => openCover(recordFile)}
          />
          {recordFile.availability_status == 'available' && (
            <OpcionMenu
              icon={<img src={Loan} alt="Prestar" className="w-5" />}
              text="Prestar"
              onClick={() => openCreateLoan(recordFile)}
            />
          )}
          {recordFile.availability_status == 'on_loan' && (
            <OpcionMenu
              icon={<img src={Receive} alt="recibir" className="w-5" />}
              text="Recibir"
              onClick={() => openReceive(recordFile)}
            />
          )}
          {recordFile.availability_status != 'on_loan' && (
            <OpcionMenu
              icon={<img src={Movement} alt="Mover" className="w-5" />}
              text="Mover"
              onClick={() => openCreateMovement(recordFile)}
            />
          )}
          {recordFile.availability_status === 'under_review' && (
            <OpcionMenu
              icon={<img src={Revision} alt="Revisar" className="w-5" />}
              text="Revisar"
              onClick={() =>
                navigate(
                  `${basePath}/record_diagnosis/new_diagnosis/record_file/${recordFile.id}`,
                )
              }
            />
          )}

          <OpcionMenu
            icon={<img src={DeleteIcon} alt="Eliminar" className="w-5" />}
            text="Eliminar"
            onClick={() => openDelete(recordFile)}
            className="text-red-500"
          />
        </MenuDesplegable>
      </span>
    </div>
  )
}
export default RecordFilesRow
