import SidebarContainer from '../containers/sidebarContainer'
import useLayout from '@contexts/layoutContext'
import { IconButton } from '@ui/iconButton'
import SidebarIcon from '@icons/sidebarW.svg'
import SidebarMenu from './sidebarMenu'

const Sidebar = () => {
  const { closeSidebar } = useLayout()

  return (
    <SidebarContainer>
      <header className="flex w-full items-center justify-between px-2 mb-4">
        <h2 className="text-3xl font-bold text-white text-shadow-lg text-center ">
          FONDOS
        </h2>
        <IconButton
          onClick={closeSidebar}
          tooltip="Cerrar"
          className="hover:bg-black-4! active:bg-black-2!"
        >
          <img src={SidebarIcon} alt="" className="icon-size" />
        </IconButton>
      </header>
      <main className="flex flex-col flex-1 w-full  overflow-y-hidden">
       <SidebarMenu/>
      </main>
    </SidebarContainer>
  )
}
export default Sidebar
