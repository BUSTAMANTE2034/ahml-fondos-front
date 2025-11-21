import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
  useLayoutEffect,
} from 'react'

interface MyMenuProps {
  trigger: ReactNode
  children: ReactNode
  className?: string
}

const MyMenu: React.FC<MyMenuProps> = ({ trigger, children, className }) => {
  const [open, setOpen] = useState(false)
  const [align, setAlign] = useState<'left' | 'right'>('left') // "left" = anclado a la izquierda
  const containerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleGlobalClose = () => setOpen(false)
    document.addEventListener('close-all-menus', handleGlobalClose as any)
    return () =>
      document.removeEventListener('close-all-menus', handleGlobalClose as any)
  }, [])

  // calcular si cabe a la derecha o izquierda
  useLayoutEffect(() => {
    if (open && menuRef.current && containerRef.current) {
      const menuWidth = menuRef.current.scrollWidth
      const triggerRect = containerRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth

      // ¿Se sale si crece hacia la derecha?
      if (triggerRect.right + menuWidth > viewportWidth) {
        // que crezca hacia la izquierda (anclado con right-0)
        setAlign('left')
      } else {
        // hay espacio hacia la derecha (anclado con left-0)
        setAlign('right')
      }
    }
  }, [open])

  const handleToggle = () => {
    if (!open) {
      document.dispatchEvent(new Event('close-all-menus'))
    }
    setOpen(!open)
  }

  return (
    <div
      className="relative inline-block text-left cursor-pointer"
      ref={containerRef}
    >
      <div onClick={handleToggle}>{trigger}</div>

      {open && (
        <div
          ref={menuRef}
          className={`
            ${className ?? ''}
            z-20 absolute top-full mt-2 min-w-35 max-w-50 bg-light-gray 
            border border-dark-gray2 rounded-2xl shadow-md p-2
            ${align === 'left' ? 'right-0' : 'left-0'}
          `}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default MyMenu
