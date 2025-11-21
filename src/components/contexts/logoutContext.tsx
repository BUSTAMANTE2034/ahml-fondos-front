import { createContext, ReactNode, useContext, useState } from 'react'

interface LogoutContextProps {
  isLogoutModalOpen: boolean
  openLogoutModal: () => void
  closeLogoutModal: () => void
}

const LogoutContext = createContext<LogoutContextProps | null>(null)

export const LogoutProvider = ({ children }: { children: ReactNode }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const openLogoutModal = () => setIsLogoutModalOpen(true)
  const closeLogoutModal = () => setIsLogoutModalOpen(false)

  return (
    <LogoutContext.Provider
      value={{ isLogoutModalOpen, openLogoutModal, closeLogoutModal }}
    >
      {children}
    </LogoutContext.Provider>
  )
}
export const useLogout = () => {
  const ctx = useContext(LogoutContext)
  if (!ctx) throw new Error('useLogout debe usarse dentro de LogoutProvider')
  return ctx
}
