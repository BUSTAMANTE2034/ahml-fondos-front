import React, { useEffect, useRef, useState } from 'react'
import xIconUrl from '@icons/closeW.svg'
import errorIconUrl from '@icons/cancelW.svg'
import warningIconUrl from '@icons/infoW.svg'
import successIconUrl from '@icons/successW.svg'
import notificationIconUrl from '@icons/infoW.svg'

export const ToastErrorBGColor = '#e40408'
export const ToastWarningBGColor = '#d25b1f'
export const ToastSuccessBGColor = '#2563EB'
export const ToastNotificationBGColor = '#3d7ebb'

export const ToastErrorIcon = errorIconUrl
export const ToastWarningIcon = warningIconUrl
export const ToastSuccessIcon = successIconUrl
export const ToastNotificationIcon = notificationIconUrl

export type ToastObject = {
  id: number
  title?: string
  description?: string
  icon: string
  backgroundColor: string
  fixed?: boolean 
}

type Props = {
  toastList: ToastObject[]
  position: 'bottom-right' | 'top-right' | 'top-left' | 'bottom-left'
  autoDelete?: boolean
  autoDeleteTime?: number // ms
  marginTop?: number
  removeToast: (id: number) => void
}

const ToastItem = ({
  toast,
  autoDelete,
  autoDeleteTime,
  removeToast,
}: {
  toast: ToastObject
  autoDelete: boolean
  autoDeleteTime: number
  removeToast: (id: number) => void
}) => {
  const timeoutRef = useRef<number | null>(null) // auto-cierre
  const rafRef = useRef<number | null>(null) // loop
  const lastTsRef = useRef<number | null>(null) // último
  const remainingRef = useRef<number>(autoDeleteTime)
  const pausedRef = useRef<boolean>(false)

  const [progress, setProgress] = useState(1)

  const clearTimeoutIfAny = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const cancelRafIfAny = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const tick = (ts: number) => {
    if (pausedRef.current) {
      lastTsRef.current = ts
      rafRef.current = requestAnimationFrame(tick)
      return
    }

    if (lastTsRef.current == null) lastTsRef.current = ts
    const dt = ts - lastTsRef.current
    lastTsRef.current = ts

    remainingRef.current = Math.max(0, remainingRef.current - dt)
    const ratio = remainingRef.current / autoDeleteTime
    setProgress(ratio)

    if (remainingRef.current <= 0) {
      removeToast(toast.id)
      return
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const start = () => {
    timeoutRef.current = window.setTimeout(
      () => removeToast(toast.id),
      remainingRef.current
    )
    rafRef.current = requestAnimationFrame(tick)
  }

  const pause = () => {
    if (pausedRef.current) return
    pausedRef.current = true
    clearTimeoutIfAny()
  }

  const resume = () => {
    if (!pausedRef.current) return
    pausedRef.current = false
    if (remainingRef.current <= 0) {
      removeToast(toast.id)
      return
    }
    timeoutRef.current = window.setTimeout(
      () => removeToast(toast.id),
      remainingRef.current
    )
  }

  useEffect(() => {
    if (autoDelete && !toast.fixed) {
      setProgress(1)
      remainingRef.current = autoDeleteTime
      pausedRef.current = false
      lastTsRef.current = null
      start()
    }
    return () => {
      clearTimeoutIfAny()
      cancelRafIfAny()
    }
  }, [toast.id, autoDelete, autoDeleteTime, toast.fixed])

  return (
    <div
      className="relative rounded-2xl flex items-center gap-3 py-3 px-4 shadow-md pointer-events-auto overflow-hidden"
      style={{ backgroundColor: toast.backgroundColor }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <img src={toast.icon} alt={toast.title ?? ''} className="h-5 w-5" />
      <div className="flex flex-col items-start flex-1 text-white">
        {toast.title && (
          <p className="font-semibold select-none whitespace-nowrap text-white">
            {toast.title}
          </p>
        )}
        {toast.description && (
          <p className="select-none text-white">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="p-1 hover:opacity-70"
      >
        <img src={xIconUrl} alt="Cerrar" className="h-4 w-4" />
      </button>

      {autoDelete && !toast.fixed && (
        <div
          className="absolute bottom-0 left-0 h-1 bg-white"
          style={{
            width: '100%',
            transform: `scaleX(${progress})`,
            transformOrigin: 'left',
            transition: pausedRef.current ? 'none' : 'transform 0.0s',
          }}
        />
      )}
    </div>
  )
}

const Toast = ({
  toastList,
  position,
  autoDelete = false,
  autoDeleteTime = 3000,
  marginTop = 0,
  removeToast,
}: Props) => {
  return (
    <div
      className={`notification-container flex flex-col gap-2 pointer-events-none ${position}`}
      style={{ top: marginTop + 10 }}
    >
      {toastList.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          autoDelete={autoDelete}
          autoDeleteTime={autoDeleteTime}
          removeToast={removeToast}
        />
      ))}
    </div>
  )
}

export default Toast
