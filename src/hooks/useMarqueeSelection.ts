import { useEffect, useRef, useState, type RefObject } from 'react'

type Rect = { left: number; top: number; width: number; height: number }

function intersects(a: Rect, b: DOMRect) {
  return a.left < b.right && a.left + a.width > b.left && a.top < b.bottom && a.top + a.height > b.top
}

export function useMarqueeSelection(containerRef: RefObject<HTMLElement | null>, onSelectionChange: (itemIds: string[]) => void) {
  const [rect, setRect] = useState<Rect | null>(null)
  const startRef = useRef<{ x: number; y: number } | null>(null)
  const onSelectionChangeRef = useRef(onSelectionChange)

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseDown = (event: MouseEvent) => {
      if (!event.ctrlKey || event.button !== 0) return
      const target = event.target as HTMLElement
      if (target.closest('input, button, textarea, a')) return

      event.preventDefault()
      startRef.current = { x: event.clientX, y: event.clientY }
      setRect({ left: event.clientX, top: event.clientY, width: 0, height: 0 })
    }

    const handleMouseMove = (event: MouseEvent) => {
      const start = startRef.current
      if (!start) return

      const next: Rect = {
        left: Math.min(start.x, event.clientX),
        top: Math.min(start.y, event.clientY),
        width: Math.abs(event.clientX - start.x),
        height: Math.abs(event.clientY - start.y),
      }
      setRect(next)

      const ids: string[] = []
      document.querySelectorAll<HTMLElement>('[data-item-id]').forEach((tile) => {
        if (intersects(next, tile.getBoundingClientRect())) ids.push(tile.dataset.itemId!)
      })
      onSelectionChangeRef.current(ids)
    }

    const handleMouseUp = () => {
      startRef.current = null
      setRect(null)
    }

    container.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      container.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [containerRef])

  return rect
}
