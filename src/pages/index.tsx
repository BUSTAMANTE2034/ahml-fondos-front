import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '@styles/index.css'
import Loader from '@ui/loader'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@contexts/toastContext'
import AppRoutes from '@/routes'
import { AuthProvider } from '@/components/contexts/authContext'
import { ChangePasswordProvider } from "@/components/contexts/changePasswordContext";

const Root = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      <ToastProvider>
        <AuthProvider>
          <ChangePasswordProvider><AppRoutes /></ChangePasswordProvider>
          
        </AuthProvider>
      </ToastProvider>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
          <Loader />
        </div>
      )}
    </>
  )
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename="/fondos">
    <StrictMode>
      <Root />
    </StrictMode>
  </BrowserRouter>
)
