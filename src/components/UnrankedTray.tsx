import { Fragment, type ChangeEvent, type DragEvent, type RefObject } from 'react'
import { useFlip } from '../hooks/useFlip'
import type { BoardLayout } from '../hooks/useTierBoard'
import type { DropTarget, ListItem } from '../types'
import { GhostTile } from './GhostTile'
import { Icon } from './Icon'
import { ItemTile } from './ItemTile'

type UnrankedTrayProps = {
  items: ListItem[]
  selectedId: string | null
  dropTarget: DropTarget | null
  layout: BoardLayout
  draggedId: string | null
  draggedItem: ListItem | null
  justPlacedId: string | null
  fileInput: RefObject<HTMLInputElement | null>
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onDropTargetChange: (target: DropTarget) => void
  onDropTargetClear: (event: DragEvent<HTMLElement>) => void
  onDrop: (event: DragEvent<HTMLElement>, beforeId?: string) => void
  onPlaceSelected: () => void
  onTileDragStart: (itemId: string) => void
  onTileDragEnd: () => void
  onTileSelect: (itemId: string) => void
  onTileDelete: (itemId: string) => void
  onTilePreview: (itemId: string) => void
}

export function UnrankedTray({
  items,
  selectedId,
  dropTarget,
  layout,
  draggedId,
  draggedItem,
  justPlacedId,
  fileInput,
  onUpload,
  onDropTargetChange,
  onDropTargetClear,
  onDrop,
  onPlaceSelected,
  onTileDragStart,
  onTileDragEnd,
  onTileSelect,
  onTileDelete,
  onTilePreview,
}: UnrankedTrayProps) {
  const isDropActive = dropTarget?.tierId === null
  const registerTile = useFlip(items.map((item) => item.id))

  return (
    <section
      className={`min-w-0 border-t border-[#e1e4dc] pt-[18px] transition-colors duration-200${
        layout === 'side-by-side' ? ' lg:basis-[calc(100%-var(--split))]' : ''
      }${selectedId ? ' cursor-copy hover:bg-[#eef1e8]' : ''}`}
      aria-label="Unranked items"
      onDragOver={(event) => {
        event.preventDefault()
        onDropTargetChange({ tierId: null })
      }}
      onDragLeave={onDropTargetClear}
      onDrop={(event) => onDrop(event)}
      onClick={() => selectedId && onPlaceSelected()}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <h2 className="m-0 font-serif text-lg font-semibold text-[#33443a] sm:text-[19px]">Not ranked yet</h2>
          <span className="text-[9px] font-bold tracking-[0.8px] text-[#9da69d]">{items.length} ITEMS</span>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded border border-[#dfe3db] bg-white px-[11px] py-2 text-[11px] text-[#4b5b50] transition-colors hover:border-[#aab9aa] hover:bg-[#fdfefb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#62876e]"
          onClick={(event) => { event.stopPropagation(); fileInput.current?.click() }}
        >
          <Icon name="upload" /> Add images
        </button>
        <input ref={fileInput} className="hidden" type="file" accept="image/*" multiple onChange={onUpload} />
      </div>
      <div
        className={`mt-2.5 flex min-h-[95px] flex-wrap items-center gap-1.5 rounded-md border border-dashed border-[#d7ddd3] bg-[#f2f4ed] p-2.5 sm:min-h-[104px] sm:gap-2 sm:p-3${
          isDropActive ? ' border-[#587e63] bg-[#edf2e9] shadow-[inset_0_0_0_1px_#587e6328]' : ''
        }`}
      >
        {items.length ? items.map((item) => (
          <Fragment key={item.id}>
            {isDropActive && draggedItem && dropTarget?.beforeId === item.id && <GhostTile item={draggedItem} />}
            <ItemTile
              ref={registerTile(item.id)}
              item={item}
              isSelected={selectedId === item.id}
              isDragging={draggedId === item.id}
              isJustPlaced={justPlacedId === item.id}
              ariaLabel={`${item.name}, unranked`}
              onDragStart={(event) => {
                onTileDragStart(item.id)
                event.dataTransfer.setData('text/plain', item.id)
                event.dataTransfer.effectAllowed = 'move'
              }}
              onDragEnd={onTileDragEnd}
              onDragOver={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onDropTargetChange({ tierId: null, beforeId: item.id })
              }}
              onDrop={(event) => onDrop(event, item.id)}
              onClick={(event) => {
                event.stopPropagation()
                onTileSelect(item.id)
              }}
              onDoubleClick={(event) => {
                event.stopPropagation()
                onTilePreview(item.id)
              }}
              onDelete={(event) => {
                event.stopPropagation()
                onTileDelete(item.id)
              }}
            />
          </Fragment>
        )) : <p className="m-auto text-xs text-[#839087]">Add some items to get started.</p>}
        {isDropActive && !dropTarget?.beforeId && draggedItem && <GhostTile item={draggedItem} />}
      </div>
    </section>
  )
}
