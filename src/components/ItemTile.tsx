import { forwardRef, type DragEvent } from 'react'
import { preloadImage } from '../lib/preloadImage'
import type { ListItem } from '../types'
import { Icon } from './Icon'

type ItemTileProps = {
  item: ListItem
  isSelected: boolean
  isDragging: boolean
  isJustPlaced: boolean
  ariaLabel: string
  onDragStart: (event: DragEvent<HTMLElement>) => void
  onDragEnd: () => void
  onDragOver: (event: DragEvent<HTMLElement>) => void
  onDrop: (event: DragEvent<HTMLElement>) => void
  onClick: (event: React.MouseEvent) => void
  onDoubleClick: (event: React.MouseEvent) => void
  onDelete: (event: React.MouseEvent) => void
}

export const ItemTile = forwardRef<HTMLElement, ItemTileProps>(function ItemTile(
  { item, isSelected, isDragging, isJustPlaced, ariaLabel, onDragStart, onDragEnd, onDragOver, onDrop, onClick, onDoubleClick, onDelete },
  ref,
) {
  return (
    <article
      ref={ref}
      className={`group relative h-[64px] w-[88px] flex-none select-none overflow-hidden rounded bg-[#e9ece4] transition-[transform,box-shadow,opacity] duration-200 [animation-fill-mode:both] cursor-grab hover:z-10 hover:-translate-y-[3px] hover:scale-[1.025] hover:shadow-[0_7px_16px_#253a2c28] active:cursor-grabbing sm:h-[70px] sm:w-[103px]${
        isJustPlaced ? ' motion-safe:animate-pop-in' : ' motion-safe:animate-tile-in'
      }${
        isSelected ? ' z-20 -translate-y-[2px] outline outline-[3px] outline-offset-2 outline-[#294e3b]' : ''
      }${
        isDragging ? ' z-30 rotate-[-4deg] scale-105 opacity-60 shadow-[0_12px_20px_#253a2c40]' : ''
      }`}
      draggable
      onMouseEnter={() => preloadImage(item.image)}
      onDragStart={(event) => {
        preloadImage(item.image)
        onDragStart(event)
      }}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      aria-label={ariaLabel}
    >
      <img className="block h-full w-full object-cover transition-transform duration-[350ms] group-hover:scale-[1.08]" src={item.image} alt="" />
      <button
        type="button"
        className="absolute right-1 top-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity hover:bg-black/75 focus-visible:opacity-100 group-hover:opacity-100"
        onClick={(event) => {
          event.stopPropagation()
          onDelete(event)
        }}
        aria-label={`Remove ${item.name}`}
      >
        <Icon name="close" className="h-3 w-3" />
      </button>
    </article>
  )
})
