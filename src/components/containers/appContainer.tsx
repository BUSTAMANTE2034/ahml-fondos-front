import { ReactNode } from 'react'

const AppContainer = ({ children }: { children: ReactNode }) => {
  return <div className="flex w-full h-screen overflow-hidden">{children}</div>
}

export default AppContainer
