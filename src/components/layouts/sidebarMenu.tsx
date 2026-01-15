import SidebarIcon from '@icons/sidebarW.svg'
import Option from '@ui/sidebarOption'
import { useAuth } from '@contexts/authContext'

import GestoresIcon from '@icons/managersW.svg'
import ArchivistsIcon from '@icons/archivistsW.svg'
import VisitorsIcon from '@icons/visitorsW.svg'

import RecordFilesIcon from '@icons/expedienteW.svg'
import LoansIcon from '@icons/loanW.svg'
import MovementsIcon from '@icons/movementsW.svg'

import KeysIcon from '@icons/catalog-keyW.svg'
import FundsIcon from '@icons/fondoW.svg'
import SectionsIcon from '@icons/seccionW.svg'
import SeriesIcon from '@icons/serieW.svg'
import TypologiesIcon from '@icons/typologyW.svg'
import DeteriorationsIcon from '@icons/deteriorationW.svg'
import LocationsIcon from '@icons/locationW.svg'
import PhysicalLocationsIcon from '@icons/pyshical_location.svg'
import BoxesIcon from '@icons/boxW.svg'

const SidebarMenu = () => {
  const { user } = useAuth()
  return (
    <div className="h-full w-full flex flex-col  px-2 overflow-y-auto scroll-gray">
      {(user?.role === 'admin' || user?.role === 'manager') && (
        <div className="flex flex-col gap-1 mb-6">
          <h2 className="py-2 font-semibold text-xl text-gray-4">Usuarios</h2>

          {user?.role !== 'admin' ? (<></>
            
          ):(<Option to={`/${user.role}/${user.id}/managers`} label="Gestores">
              <img src={GestoresIcon} alt="Gestores" />
            </Option>)}

          <Option
            to={`/${user.role}/${user.id}/archivists`}
            label="Archivistas"
          >
            <img src={ArchivistsIcon} alt="Archivistas" />
          </Option>

          <Option to={`/${user.role}/${user.id}/visitors`} label="Visitantes">
            <img src={VisitorsIcon} alt="Visitantes" />
          </Option>
        </div>
      )}

      <div className="flex flex-col gap-1 mb-6">
        <h2 className=" py-2 font-semibold text-xl text-gray-4">Gestión</h2>
        <Option
          to={`/${user?.role}/${user?.id}/record-files`}
          label="Expedientes"
        >
          <img src={RecordFilesIcon} alt="Expedientes" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/loans`} label="Préstamos">
          <img src={LoansIcon} alt="Préstamos" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/movements`} label="Movimientos">
          <img src={MovementsIcon} alt="Movimientos" />
        </Option>
      </div>
      {(user?.role === 'admin' || user?.role === 'manager'|| user?.role === 'archivist') && (<div className="flex flex-col gap-1 mb-6">
        <h2 className=" py-2 font-semibold text-xl text-gray-4">Catálogo</h2>
        <Option
          to={`/${user?.role}/${user?.id}/catalog-keys`}
          label="Catálogo de claves"
        >
          <img src={KeysIcon} alt="Clave de catálogo" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/funds`} label="Fondos">
          <img src={FundsIcon} alt="Fondos" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/sections`} label="Secciones">
          <img src={SectionsIcon} alt="Secciones" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/series`} label="Series">
          <img src={SeriesIcon} alt="Series" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/boxes`} label="Cajas">
          <img src={BoxesIcon} alt="Cajas" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/typologies`} label="Tipologías">
          <img src={TypologiesIcon} alt="Tipologías" />
        </Option>
        <Option
          to={`/${user?.role}/${user?.id}/deteriorations`}
          label="Deterioros"
        >
          <img src={DeteriorationsIcon} alt="Deterioros" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/locations`} label="Localidades">
          <img src={LocationsIcon} alt="Localidades" />
        </Option>
        <Option to={`/${user?.role}/${user?.id}/physical_locations`} label="Ubicaciones físicas">
          <img src={PhysicalLocationsIcon} alt="Ubicaciones físicas" />
        </Option>
      </div>)}
      
    </div>
  )
}
export default SidebarMenu
