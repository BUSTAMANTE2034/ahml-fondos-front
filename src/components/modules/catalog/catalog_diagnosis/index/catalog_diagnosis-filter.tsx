import MenuDesplegable from '@ui/myMenu'
import Filter from '@icons/filter.svg'

import ActiveFilter from './catalog_diagnosis-active-filter'
import ConceptFilter from './catalog_diagnosis-concept-filter'
import DetailFilter from './catalog_diagnosis-detail-filter'

import { useDiagnosisCatalog } from './catalog_diagnosis-context'

const DiagnosisCatalogFilter = () => {
  const {
    is_active,
    setIsActive,
    concept,
    setConcept,
    detail,
    setDetail,
  } = useDiagnosisCatalog()

  const hasFilters = Boolean(is_active !== null || concept || detail)

  return (
    <div className="flex flex-row justify-between items-center">
      <span
        className={`${
          hasFilters
            ? 'text-tblack font-semibold'
            : 'text-dark-gray2'
        } text-xs md:text-sm`}
      >
        Filtros
      </span>

      <MenuDesplegable
        trigger={<img src={Filter} alt="menu" className="icon-size" />}
      >
        {/* ACTIVO / INACTIVO */}
        <ActiveFilter
          is_active={is_active}
          setIsActive={setIsActive}
        />

        {/* CONCEPTO */}
        <ConceptFilter
          concept={concept}
          setConcept={setConcept}
        />

        {/* DETALLE */}
        <DetailFilter
          detail={detail}
          setDetail={setDetail}
        />
      </MenuDesplegable>
    </div>
  )
}

export default DiagnosisCatalogFilter
