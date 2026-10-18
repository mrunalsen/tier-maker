import { useLayoutEffect, useRef } from 'react'

const FLIP_DURATION_MS = 220

export function useFlip(order: string[]) {
  const nodes = useRef(new Map<string, HTMLElement>())
  const prevRects = useRef(new Map<string, DOMRect>())

  const register = (id: string) => (node: HTMLElement | null) => {
    if (node) nodes.current.set(id, node)
    else nodes.current.delete(id)
  }

  useLayoutEffect(() => {
    const nextRects = new Map<string, DOMRect>()
    nodes.current.forEach((node, id) => nextRects.set(id, node.getBoundingClientRect()))

    nodes.current.forEach((node, id) => {
      const prev = prevRects.current.get(id)
      const next = nextRects.get(id)
      if (!prev || !next) return

      const dx = prev.left - next.left
      const dy = prev.top - next.top
      if (!dx && !dy) return

      node.style.transition = 'none'
      node.style.transform = `translate(${dx}px, ${dy}px)`
      node.getBoundingClientRect()
      requestAnimationFrame(() => {
        node.style.transition = `transform ${FLIP_DURATION_MS}ms ease`
        node.style.transform = ''
      })
    })

    prevRects.current = nextRects
    // Re-run whenever the visible order of tiles changes, not on every items/order identity change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order.join('|')])

  return register
}
