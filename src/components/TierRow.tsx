import { Fragment, type DragEvent } from 'react';
import { useFlip } from '../hooks/useFlip';
import type { DropTarget, ListItem, Tier } from '../types';
import { GhostTile } from './GhostTile';
import { ItemTile } from './ItemTile';

type TierRowProps = {
  tier: Tier;
  index: number;
  items: ListItem[];
  selectedId: string | null;
  dropTarget: DropTarget | null;
  draggedId: string | null;
  draggedItem: ListItem | null;
  justPlacedId: string | null;
  onRenameTier: (tierId: string, name: string) => void;
  onRowDragOver: (tierId: string) => void;
  onRowDragLeave: (event: DragEvent<HTMLElement>) => void;
  onRowDrop: (event: DragEvent<HTMLElement>, tierId: string) => void;
  onRowClick: (tierId: string) => void;
  onTileDragStart: (event: DragEvent<HTMLElement>, itemId: string) => void;
  onTileDragEnd: () => void;
  onTileDragOver: (event: DragEvent<HTMLElement>, tierId: string, itemId: string) => void;
  onTileDrop: (event: DragEvent<HTMLElement>, tierId: string, itemId: string) => void;
  onTileClick: (event: React.MouseEvent, itemId: string) => void;
  onTileDoubleClick: (event: React.MouseEvent, itemId: string) => void;
  onTileDelete: (event: React.MouseEvent, itemId: string) => void;
  onLabelContextMenu: (event: React.MouseEvent, tierId: string) => void;
};

export function TierRow({
  tier,
  index,
  items,
  selectedId,
  dropTarget,
  draggedId,
  draggedItem,
  justPlacedId,
  onRenameTier,
  onRowDragOver,
  onRowDragLeave,
  onRowDrop,
  onRowClick,
  onTileDragStart,
  onTileDragEnd,
  onTileDragOver,
  onTileDrop,
  onTileClick,
  onTileDoubleClick,
  onTileDelete,
  onLabelContextMenu,
}: TierRowProps) {
  const isDropActive = dropTarget?.tierId === tier.id;
  const registerTile = useFlip(items.map((item) => item.id));

  return (
    <div
      className={`flex min-h-[84px] motion-safe:animate-rise-in overflow-hidden rounded-md border border-[#e6e7df] bg-white transition-[border-color,box-shadow] duration-200 sm:min-h-[91px]${selectedId ? ' cursor-copy hover:border-[#8fac94] hover:shadow-[0_0_0_2px_#8fac9429]' : ''
        }${isDropActive ? ' border-[#587e63] shadow-[0_0_0_2px_#587e6328,0_4px_14px_#294b3512]' : ''
        }`}
      style={{ animationDelay: `${index * 0.04}s` }}
      onDragOver={(event) => {
        event.preventDefault();
        onRowDragOver(tier.id);
      }}
      onDragLeave={onRowDragLeave}
      onDrop={(event) => onRowDrop(event, tier.id)}
      onClick={() => onRowClick(tier.id)}
    >
      <div
        className={`grid min-h-[82px] w-[68px] flex-none place-items-center transition-[filter] sm:min-h-[89px] sm:w-[112px]${isDropActive ? ' saturate-[1.13]' : ''}`}
        style={{ backgroundColor: tier.color }}
        onContextMenu={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onLabelContextMenu(event, tier.id);
        }}
      >
        <input
          aria-label={`Tier ${index + 1} name`}
          className="w-full min-w-0 border-0 bg-transparent text-center font-serif text-2xl font-semibold leading-none text-[#28352d] outline-none focus:underline focus:decoration-1 focus:underline-offset-[5px] focus-visible:outline-none sm:text-[29px]"
          value={tier.name}
          maxLength={12}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => onRenameTier(tier.id, event.target.value)}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap content-start items-center gap-1.5 p-1.5 sm:gap-2 sm:p-2.5">
        {items.map((item) => (
          <Fragment key={item.id}>
            {isDropActive && draggedItem && dropTarget?.beforeId === item.id && <GhostTile item={draggedItem} />}
            <ItemTile
              ref={registerTile(item.id)}
              item={item}
              isSelected={selectedId === item.id}
              isDragging={draggedId === item.id}
              isJustPlaced={justPlacedId === item.id}
              ariaLabel={`${item.name}, ranked ${tier.name}`}
              onDragStart={(event) => onTileDragStart(event, item.id)}
              onDragEnd={onTileDragEnd}
              onDragOver={(event) => onTileDragOver(event, tier.id, item.id)}
              onDrop={(event) => onTileDrop(event, tier.id, item.id)}
              onClick={(event) => onTileClick(event, item.id)}
              onDoubleClick={(event) => onTileDoubleClick(event, item.id)}
              onDelete={(event) => onTileDelete(event, item.id)}
            />
          </Fragment>
        ))}
        {isDropActive && !dropTarget?.beforeId && draggedItem && <GhostTile item={draggedItem} />}
      </div>
    </div>
  );
}
