import { ReactNode, useEffect, useRef } from 'react'
import useLayout from '@contexts/layoutContext'

interface SidebarContainerProps {
  children: ReactNode
  onClose?: () => void
}
const SidebarContainer = ({
  children,
  onClose = () => {},
}: SidebarContainerProps) => {
  const { sidebarOpen } = useLayout()
  const sidebarRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (e: MouseEvent) => {
    if (
      sidebarOpen &&
      window.innerWidth < 768 &&
      sidebarRef.current &&
      !sidebarRef.current.contains(e.target as Node)
    )
      onClose()
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, sidebarOpen])
  return (
    <aside
      ref={sidebarRef}
      className={`fixed inset-y-0 left-0 z-50 items-center flex flex-col justify-center min-h-screen w-55 py-2 overflow-y-hidden
        border-r-2 border-gray-3 bg-black-3
        transform transition-transform duration-300 ease-in-out
    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      }`}
    >
      {children}
    </aside>
  )
}
export default SidebarContainer
