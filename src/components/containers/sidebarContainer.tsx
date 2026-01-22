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
    ) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () =>
      document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose, sidebarOpen])

  return (
    // <aside
    //   ref={sidebarRef}
    //   className={`
    //     fixed inset-y-0 left-0 z-50
    //     flex flex-col
    //     w-56
    //     bg-black-3
    //     border-r border-gray-4
    //     px-3 py-4
    //     overflow-y-auto
    //     transform transition-transform duration-300 ease-in-out
    //     ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
    //   `}
    // >
    //   {children}
    // </aside>
    <aside
      ref={sidebarRef}
      className={`
        fixed inset-y-0 left-0 z-50
        flex flex-col
        w-56
        bg-black-3
        border-r border-gray-4
        px-3 py-4
        overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {children}
    </aside>
  )
}

export default SidebarContainer
