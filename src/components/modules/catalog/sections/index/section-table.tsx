import { SectionsProvider, useSections } from './section-context'
import SectionFilter from './section-filter'
import SearchSection from './section-search'
import SectionsPaginator from './section-paginator'
import Loader from '@ui/loader'
import { Card, CardBody, CardHeader } from '@ui/card'
import SectionRow from './section-row'
import CreateSectionModal from '../modals/create-section-modal'
import UpdateSectionModal from '../modals/edit-section-modal'
import DeleteSectionModal from '../modals/delete-section-modal'
import ShowSectionModal from '../modals/show-section-modal'
import EnableSectionModal from '../modals/enable-section-modal'
import DisableSectionModal from '../modals/disable-section-modal'

const Table = () => {
  const {
    sections,
    loadingGet,
    errorGet,openCreate
  } = useSections()

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row gap-8 items-center w-full mb-4 md:mb-0 flex-1">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-main-green flex flex-1 justify-start w-full">
            Secciones
          </h2>

          <SectionFilter />
        </div>

        <div className="flex justify-between w-full md:w-auto md:gap-4">
          <SearchSection />
          <button onClick={openCreate} className="create">
            <span>Agregar</span>
          </button>
        </div>
      </CardHeader>

      <div className="grid grid-cols-[1.6fr_0.6fr_0.6fr_0.2fr]  md:grid-cols-[0.4fr_1.8fr_0.4fr_0.8fr_0.8fr_0.2fr] px-2  w-full items-center   border-b-2   border-main-blue font-semibold text-sm md:text-base text-left">
        {/* THEAD */}
        <span className="hidden lg:block">Clave</span>
        <span className="">Nombre</span>
        <span className='hidden lg:block'>Acrónimo</span>
        <span className=''>Fecha Inicio</span>
        <span className=''>Fecha Fin</span>
        <span></span>
      </div>

      <CardBody>
        {loadingGet ? (
          <div className='flex w-full h-full items-start'><Loader label="Cargando..." size={50} /></div>
          
        ) : errorGet ? (
          <div className="text-dark2-gray text-center w-full h-full flex items-start justify-center">
            {errorGet||'Error al obtener las claves.'}
          </div>
        ) : sections.length > 0 ? (
          <div className="w-full h-full">
            <div className=" w-full grid gap-1">
              {sections.map((section) => (
               <SectionRow key={section.id} item={section}/>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-dark2-gray py-8 flex items-start justify-center w-full h-full">
            No hay secciones para mostrar.
          </div>
        )}
      </CardBody>

      {!loadingGet && !errorGet && sections.length > 0 && (
        <SectionsPaginator />
      )}
      <CreateSectionModal/>
      <UpdateSectionModal/>
      <DeleteSectionModal/>
      <EnableSectionModal/>
      <DisableSectionModal/>
      <ShowSectionModal/>

    </Card>
  )
}

const SectionsTable = () => {
  return (
    <SectionsProvider>
      <Table/>
    </SectionsProvider>
  )
}

export default SectionsTable
