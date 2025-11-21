import { ReactNode } from 'react'
import AppContainer from '../containers/appContainer'
import MainContainer from '../containers/mainContainer'
import Header from './header'
import useLayout, { LayoutProvider } from '@contexts/layoutContext'
import Sidebar from './sidebar'
import { LogoutProvider } from '../contexts/logoutContext'
import { ChangePasswordProvider } from '../contexts/changePasswordContext'
type MainLayoutProps = {
  children?: React.ReactNode
}
const Layout = ({ children }: MainLayoutProps) => {
  return (
    <AppContainer>
      <Sidebar />
      <MainContainer>
        <Header />
        <main className="flex flex-col flex-1 w-full min-h-0 items-center justify-center overflow-y-hidden">
          {children}
        </main>
      </MainContainer>
    </AppContainer>
  )
}

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <LayoutProvider>
      <LogoutProvider>
        <ChangePasswordProvider>
          <Layout>{children}</Layout>
        </ChangePasswordProvider>
      </LogoutProvider>
    </LayoutProvider>
  )
}
export default MainLayout
