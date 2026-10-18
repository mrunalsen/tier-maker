import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { playPlaceSound } from '../lib/sound'
import type { DropTarget, ListItem, Tier } from '../types'

const startingTiers: Tier[] = [
  { id: 's', name: 'S', color: '#f36b50' },
  { id: 'a', name: 'A', color: '#f4a640' },
  { id: 'b', name: 'B', color: '#f2d553' },
  { id: 'c', name: 'C', color: '#72b889' },
  { id: 'd', name: 'D', color: '#72a7cb' },
]

const startingItems: ListItem[] = []

const tierColors = ['#c187c8', '#e7809a', '#71b7b1', '#db8c62']

export type BoardLayout = 'stacked' | 'side-by-side'

export const SPLIT_MIN = 20
export const SPLIT_MAX = 80

export function useTierBoard() {
  const [title, setTitle] = useState('My tier list')
  const [tiers, setTiers] = useState(startingTiers)
  const [items, setItems] = useState(startingItems)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [layout, setLayout] = useState<BoardLayout>('stacked')
  const [splitPercent, setSplitPercentRaw] = useState(60)
  const [justPlacedId, setJustPlacedId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)
  const justPlacedTimeout = useRef<number | undefined>(undefined)

  const setSplitPercent = (percent: number) => {
    setSplitPercentRaw(Math.min(SPLIT_MAX, Math.max(SPLIT_MIN, percent)))
  }

  const placeItem = (itemId: string, tierId: string | null, beforeId?: string) => {
    const moving = items.find((item) => item.id === itemId)
    if (!moving) return

    setItems((current) => {
      const remaining = current.filter((item) => item.id !== itemId)
      const placed = { ...moving, tierId }
      let insertAt = beforeId ? remaining.findIndex((item) => item.id === beforeId) : -1
      if (insertAt < 0) {
        const lastInTier = remaining.reduce((last, item, index) => item.tierId === tierId ? index : last, -1)
        insertAt = lastInTier + 1
      }
      remaining.splice(insertAt, 0, placed)
      return remaining
    })
    setSelectedId(null)
    setDraggedId(null)
    setDropTarget(null)

    setJustPlacedId(itemId)
    window.clearTimeout(justPlacedTimeout.current)
    justPlacedTimeout.current = window.setTimeout(() => setJustPlacedId(null), 320)
    playPlaceSound()
  }

  const handleDrop = (event: DragEvent<HTMLElement>, tierId: string | null, beforeId?: string) => {
    event.preventDefault()
    event.stopPropagation()
    const itemId = event.dataTransfer.getData('text/plain') || draggedId
    if (itemId) placeItem(itemId, tierId, beforeId)
  }

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    const additions = files.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '),
      image: URL.createObjectURL(file),
      tierId: null,
    }))
    if (additions.length) setItems((current) => [...current, ...additions])
    event.target.value = ''
  }

  const addTier = () => {
    const nextName = String.fromCharCode(65 + tiers.length - 1)
    setTiers((current) => [...current, {
      id: `tier-${Date.now()}`,
      name: nextName,
      color: tierColors[(current.length - startingTiers.length) % tierColors.length],
    }])
  }

  const renameTier = (tierId: string, name: string) => {
    setTiers((current) => current.map((entry) => entry.id === tierId ? { ...entry, name } : entry))
  }

  const removeTier = (tierId: string) => {
    setTiers((current) => current.filter((tier) => tier.id !== tierId))
    setItems((current) => current.map((item) => item.tierId === tierId ? { ...item, tierId: null } : item))
  }

  const removeItem = (itemId: string) => {
    setItems((current) => {
      const target = current.find((item) => item.id === itemId)
      if (target?.image.startsWith('blob:')) URL.revokeObjectURL(target.image)
      return current.filter((item) => item.id !== itemId)
    })
    setSelectedId((current) => current === itemId ? null : current)
  }

  const resetBoard = () => {
    setItems((current) => current.map((item) => ({ ...item, tierId: null })))
    setSelectedId(null)
  }

  const selectItem = (itemId: string) => {
    setSelectedId((current) => current === itemId ? null : itemId)
  }

  const startDrag = (itemId: string) => {
    setDraggedId(itemId)
    setDropTarget(null)
  }

  const endDrag = () => {
    setDraggedId(null)
    setDropTarget(null)
  }

  const clearDropTarget = (event: DragEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTarget(null)
  }

  const toggleLayout = () => {
    setLayout((current) => current === 'stacked' ? 'side-by-side' : 'stacked')
  }

  const openPreview = (itemId: string) => setPreviewId(itemId)
  const closePreview = () => setPreviewId(null)

  const unranked = items.filter((item) => item.tierId === null)
  const previewItem = items.find((item) => item.id === previewId) ?? null
  const draggedItem = items.find((item) => item.id === draggedId) ?? null

  return {
    title,
    setTitle,
    tiers,
    items,
    unranked,
    dropTarget,
    selectedId,
    draggedId,
    draggedItem,
    justPlacedId,
    previewItem,
    layout,
    splitPercent,
    setSplitPercent,
    fileInput,
    setDropTarget,
    placeItem,
    handleDrop,
    handleUpload,
    addTier,
    renameTier,
    removeTier,
    removeItem,
    resetBoard,
    selectItem,
    startDrag,
    endDrag,
    clearDropTarget,
    toggleLayout,
    openPreview,
    closePreview,
  }
}
