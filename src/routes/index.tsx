import R404 from '@pages/404'
import LoginView from '@pages/auth'
import { Routes, Route, Navigate } from 'react-router-dom'
import LogoutView from '@pages/logout'
import { adminRoutes,managerRoutes,archivistRoutes,visitorRoutes } from './routes'
import ProtectedRoute from '@components/security/protectedRoute'
import AutoHome from '@components/security/authHome'
import LoginGate from '@/components/security/loginGate'
import FirstLoginPage from '@/pages/recover'
import PhysicalLocationShowPage from '@/pages/modules/catalog/pyshical_location/show'
import PhysicalLocationDetailPage from '@pages/modules/catalog/pyshical_location/detail'
const AppRoutes = () => {
  return (
    
    <Routes>
      {/* <Route path="/" element={<Navigate replace to={'login'} />} />
      <Route path="/login" element={<RLogin />} /> */}
       <Route path="/" element={<AutoHome />} />
       <Route path="/physical_locations/:code" element={<PhysicalLocationShowPage />} />
        <Route path="/physical_locations/:code/detail" element={<PhysicalLocationDetailPage />} />

  {/* (Opcional) /login solo si no estás logueado */}
  <Route path="/login" element={
    <LoginGate>
      <LoginView />
    </LoginGate>
  } />
  <Route path="/first-login" element={<FirstLoginPage />} />
      <Route path="/logout" element={<LogoutView/>} />
      <Route path="*" element={<R404 />} />
      

      {/**RUTAS PRIVADAS
       * Administradores /admin
       * Gestor /manager
       * Archivista/archivist
       * Visitante /visitor
       */}
      <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
        <Route path="/admin/:id">
          <Route index element={<Navigate replace to="managers" />} />
          {adminRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
        <Route path="/manager/:id">
          <Route index element={<Navigate replace to="archivists" />} />
          {managerRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['archivist']} />}>
        <Route path="/archivist/:id">
          <Route index element={<Navigate replace to="record-files" />} />
          {archivistRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['visitor']} />}>
        <Route path="/visitor/:id">
          <Route index element={<Navigate replace to="record-files" />} />
          {visitorRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Route>
      </Route>
    </Routes>
  )
}

export default AppRoutes
