import MenuDesplegable from '@ui/myMenu'
import OpcionMenu from '@ui/menuItem'

import Edit from '@icons/edit.svg'
import DeleteIcon from '@icons/deleteR.svg'
import Menu from '@icons/options.svg'
import Eye from '@icons/eye.svg'

import { RecordDiagnosis } from '@/lib/api/models/record_diagnosis'
import { formatFecha } from '@/components/ui/functions'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRecordDiagnosis } from './record-diagnosis-context'

interface Props {
  item: RecordDiagnosis
}

const RecordDiagnosisRow = ({ item }: Props) => {
  const { openDelete, openShow,openEdit } = useRecordDiagnosis()

  const navigate = useNavigate()
  const location = useLocation()

  //  base correcta
  const basePath =
    location.pathname.split('/record_diagnosis')[0] + '/record_diagnosis'

  const goEdit = () => {
    navigate(`${basePath}/edit/${item.id}`)
  }
// item.record_file?.deterioration_status.name ?? 
  return (
    <div className="grid grid-cols-[0.7fr_0.7fr_0.7fr_0.2fr]  md:grid-cols-[0.7fr_0.6fr_1.6fr_0.6fr_0.2fr] px-2 rounded-2xl hover:bg-main-gray text-xs">
      <span>{item.record_file?.reference_code || 'Cargando'}</span>
      <span className=' text-[10px] md:text-xs' >{formatFecha(item.record_file?.updated_at || 'Cargando')}</span>
      <span className='md:block hidden'>{item.observations || 'Sin Observaciones'}</span>
      <span className=' text-[10px] md:text-xs'>{formatFecha(item.revision_date)}</span>

      <MenuDesplegable
        trigger={<img src={Menu} className="h-7 w-7 cursor-pointer" />}
      >
        <OpcionMenu
          icon={<img src={Eye} className="w-5" />}
          text="Ver"
          onClick={() => openShow(item)}
        />

        <OpcionMenu
  icon={<img src={Edit} alt="Editar" className="w-5" />}
  text="Editar"
  onClick={() => openEdit(item)}
/>

        <OpcionMenu
          icon={<img src={DeleteIcon} className="w-5" />}
          text="Eliminar"
          onClick={() => openDelete(item)}
          className="text-red-500"
        />
      </MenuDesplegable>
    </div>
  )
}

export default RecordDiagnosisRow
