import useLayout from '@contexts/layoutContext'
import { IconButton } from '@ui/iconButton'
import SidebarIcon from '@icons/sidebar.svg'
import PersonIcon from '@icons/account.svg'
import { useAuth } from '@contexts/authContext'
import { useLogout } from '@contexts/logoutContext'
import LogoutConfirmationModal from './modals/logoutModal'
import UserMenu from './modals/userMenu'

import { useState } from 'react'
import ChangePasswordModal from './modals/change-password-modal'
const Header = () => {
  const { openSidebar, sidebarOpen } = useLayout()
  const { user } = useAuth()
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const { isLogoutModalOpen,closeLogoutModal } = useLogout()
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)

  const toggleUserMenu = () => setIsUserMenuOpen((prev) => !prev)
  const closeUserMenu = () => setIsUserMenuOpen(false)

 

  // Modal config
  const handleOpenConfigModal = () => {
    closeUserMenu()
    setIsConfigModalOpen(true)
  }
  const handleCloseConfigModal = () => {
    setIsConfigModalOpen(false)
      window.history.replaceState(null, '', window.location.pathname)

  }

  
  return (
    <header
      className={`flex flex-row items-center w-full  p-2 ${
        sidebarOpen ? 'justify-end' : 'justify-between'
      } `}
    >
      <IconButton
        onClick={openSidebar}
        tooltip="Abrir"
        className={`${sidebarOpen ? 'hidden' : 'flex'}`}
      >
        <img src={SidebarIcon} alt="" className="icon-size" />
      </IconButton>
      
       <IconButton
       onClick={toggleUserMenu}
        tooltip="Menu"
      >
        <img src={PersonIcon} alt="" className="icon-size" />
      </IconButton>
      {isUserMenuOpen && user && (
          <UserMenu
            user={user}
            onClose={closeUserMenu}
            onOpenConfig={handleOpenConfigModal}
          />
        )}
      
      
<LogoutConfirmationModal/>
<ChangePasswordModal/>
    </header>
  )
}
export default Header
