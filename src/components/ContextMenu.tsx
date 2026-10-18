import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

type ContextMenuProps = {
  x: number
  y: number
  onClose: () => void
  children: ReactNode
}

export function ContextMenu({ x, y, onClose, children }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: y, left: x })

  useLayoutEffect(() => {
    const menu = menuRef.current
    if (!menu) return
    const rect = menu.getBoundingClientRect()
    const left = Math.min(x, Math.max(8, window.innerWidth - rect.width - 8))
    const top = Math.min(y, Math.max(8, window.innerHeight - rect.height - 8))
    setPosition({ top, left })
  }, [x, y])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div
      ref={menuRef}
      role="menu"
      className="fixed z-50 min-w-[170px] overflow-hidden rounded-md border border-[#e2e5dc] bg-white py-1 shadow-[0_10px_30px_#17221d33] motion-safe:animate-rise-in"
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>
  )
}
