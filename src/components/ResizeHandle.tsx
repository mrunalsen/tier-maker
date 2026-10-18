import { useRef, type PointerEvent } from 'react'
import type { RefObject } from 'react'

type ResizeHandleProps = {
  containerRef: RefObject<HTMLDivElement | null>
  value: number
  min: number
  max: number
  onChange: (percent: number) => void
}

export function ResizeHandle({ containerRef, value, min, max, onChange }: ResizeHandleProps) {
  const dragging = useRef(false)

  const updateFromClientX = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0) return
    onChange(((clientX - rect.left) / rect.width) * 100)
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize tier board and unranked tray panes"
      aria-valuenow={Math.round(value)}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      className="hidden w-4 shrink-0 cursor-col-resize touch-none items-center justify-center self-stretch lg:flex focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#62876e]"
      onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
        event.preventDefault()
        dragging.current = true
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
        if (!dragging.current) return
        updateFromClientX(event.clientX)
      }}
      onPointerUp={(event: PointerEvent<HTMLDivElement>) => {
        dragging.current = false
        event.currentTarget.releasePointerCapture(event.pointerId)
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') onChange(value - 2)
        if (event.key === 'ArrowRight') onChange(value + 2)
      }}
    >
      <span className="h-10 w-1 rounded-full bg-[#d7ddd3] transition-colors hover:bg-[#8fac94]" />
    </div>
  )
}
