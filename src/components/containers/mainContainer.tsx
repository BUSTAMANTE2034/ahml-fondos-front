import { ReactNode } from 'react'
import useLayout from '@contexts/layoutContext'

interface MainContainerProps {
  children: ReactNode
}
const MainContainer = ({ children }: MainContainerProps) => {
  const { sidebarOpen } = useLayout()
  return (
    <main
      className={`flex flex-col  flex-1 min-h-0  w-full overflow-hidden  transition-all duration-500 ease-in-out 
        ${sidebarOpen ? 'md:ml-55' : 'md:ml-0'}`}
    >
      {children}
    </main>
  )
}
export default MainContainer
