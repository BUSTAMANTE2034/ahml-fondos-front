import ManagersView from '@pages/modules/users/manager'
import ArchivistsView from '@pages/modules/users/archivist'
import VisitorsView from '@pages/modules/users/visitor'
import LoansView from '@pages/modules/loans'
import MovementsView from '@pages/modules/movements'
import RecordFilesView from '@pages/modules/record-files'
import FundsView from '@pages/modules/catalog/fund'
import DeteriorationsView from '@pages/modules/catalog/deterioration'
import CatalogKeysView from '@pages/modules/catalog/keys'
import LocationsView from '@pages/modules/catalog/location'
import SectionsView from '@pages/modules/catalog/section'
import SeriesView from '@pages/modules/catalog/series'
import TypologiesView from '@pages/modules/catalog/typology'
import PhysicalLocationsView from '@pages/modules/catalog/pyshical_location'
import BoxView from '@pages/modules/catalog/box'
import CatalogDiagnosisView from '@/pages/modules/catalog/catalog_diagnosis'
import RecordDiagnosisView from '@/pages/modules/record_diagnosis'
import CreateRecordDiagnosisView from '@/components/modules/record-diagnosis/modals/create-record-diagnosis-view'
import path from 'path'

const adminRoutes = [
  { path: 'managers', element: <ManagersView /> },
  { path: 'archivists', element: <ArchivistsView /> },
  { path: 'visitors', element: <VisitorsView /> },
  { path: 'record-files', element: <RecordFilesView /> },
  { path: 'record-files/:record_file_id', element: <RecordFilesView /> },
  { path: 'movements', element: <MovementsView /> },
  { path: 'loans', element: <LoansView /> },
  { path: 'catalog-keys', element: <CatalogKeysView /> },
  { path: 'funds', element: <FundsView /> },
  { path: 'sections', element: <SectionsView /> },
  { path: 'series', element: <SeriesView /> },
  { path: 'locations', element: <LocationsView /> },
  { path: 'deteriorations', element: <DeteriorationsView /> },
  { path: 'typologies', element: <TypologiesView /> },
  { path: 'physical_locations', element: <PhysicalLocationsView /> },
  // { path: 'physical_locations/:code', element: <PhysicalLocationsView/> },
  { path: 'boxes', element: <BoxView /> },
  { path: 'catalog_diagnosis', element: <CatalogDiagnosisView /> },
  // {path: 'record_diagnosis', element: <RecordDiagnosisView /> },
  {
    path: 'record_diagnosis',
    element: <RecordDiagnosisView />,
  },
  {
    path: 'record_diagnosis/new_diagnosis/record_file/:record_file_id',
    element: <RecordDiagnosisView />,
  },
  
]
const managerRoutes = [
  { path: 'archivists', element: <ArchivistsView /> },
  { path: 'visitors', element: <VisitorsView /> },
  { path: 'record-files', element: <RecordFilesView /> },
  { path: 'record-files/:record_file_id', element: <RecordFilesView /> },
  { path: 'movements', element: <MovementsView /> },
  { path: 'loans', element: <LoansView /> },
  { path: 'catalog-keys', element: <CatalogKeysView /> },
  { path: 'funds', element: <FundsView /> },
  { path: 'sections', element: <SectionsView /> },
  { path: 'series', element: <SeriesView /> },
  { path: 'locations', element: <LocationsView /> },
  { path: 'deteriorations', element: <DeteriorationsView /> },
  { path: 'typologies', element: <TypologiesView /> },
  { path: 'physical_locations', element: <PhysicalLocationsView /> },
  // { path: 'physical_locations/:code', element: <PhysicalLocationsView /> },
  { path: 'boxes', element: <BoxView /> },
  { path: 'catalog_diagnosis', element: <CatalogDiagnosisView /> },
  {
    path: 'record_diagnosis',
    element: <RecordDiagnosisView />,
  },
  {
    path: 'record_diagnosis/new_diagnosis/record_file/:record_file_id',
    element: <RecordDiagnosisView />,
  },
]
const archivistRoutes = [
  { path: 'record-files', element: <RecordFilesView /> },
  { path: 'movements', element: <MovementsView /> },
  { path: 'loans', element: <LoansView /> },
  { path: 'catalog-keys', element: <CatalogKeysView /> },
  { path: 'funds', element: <FundsView /> },
  { path: 'sections', element: <SectionsView /> },
  { path: 'series', element: <SeriesView /> },
  { path: 'locations', element: <LocationsView /> },
  { path: 'deteriorations', element: <DeteriorationsView /> },
  { path: 'typologies', element: <TypologiesView /> },
  { path: 'physical_locations', element: <PhysicalLocationsView /> },
  // { path: 'physical_locations/:code', element: <PhysicalLocationsView /> },
  { path: 'boxes', element: <BoxView /> },
]
const visitorRoutes = [{ path: 'record-files', element: <RecordFilesView /> }]

export { adminRoutes, managerRoutes, archivistRoutes, visitorRoutes }
