import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface LayoutContextProps {
  sidebarOpen: boolean
  setSidebarOpen: (b: boolean) => void
  closeSidebar: () => void
  openSidebar: () => void
}

const LayoutContext = createContext<LayoutContextProps | null>(null)

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  )

  const handleResize = () => {
    const open = window.innerWidth >= 1024
    setSidebarOpen(open)
  }
  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const openSidebar = () => {
    setSidebarOpen(true)
  }
  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <LayoutContext.Provider
      value={{ sidebarOpen, setSidebarOpen, closeSidebar, openSidebar }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

const useLayout = () => {
  const ctx = useContext(LayoutContext)
  if (!ctx) throw new Error('useLayout debe usarse dentro de LayoutProvider')

  return ctx
}

export default useLayout
