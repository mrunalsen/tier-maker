import { useState, type DragEvent } from 'react';
import type { BoardLayout } from '../hooks/useTierBoard';
import type { DropTarget, ListItem, Tier } from '../types';
import { ContextMenu } from './ContextMenu';
import { Icon } from './Icon';
import { TierRow } from './TierRow';

type TierBoardProps = {
  tiers: Tier[];
  items: ListItem[];
  selectedId: string | null;
  dropTarget: DropTarget | null;
  draggedId: string | null;
  draggedItem: ListItem | null;
  justPlacedId: string | null;
  layout: BoardLayout;
  onRenameTier: (tierId: string, name: string) => void;
  onRemoveTier: (tierId: string) => void;
  onAddTier: () => void;
  onDropTargetChange: (target: DropTarget) => void;
  onDropTargetClear: (event: DragEvent<HTMLElement>) => void;
  onDrop: (event: DragEvent<HTMLElement>, tierId: string | null, beforeId?: string) => void;
  onPlaceSelected: (tierId: string) => void;
  onTileDragStart: (itemId: string) => void;
  onTileDragEnd: () => void;
  onTileSelect: (itemId: string) => void;
  onTileDelete: (itemId: string) => void;
  onTilePreview: (itemId: string) => void;
};

export function TierBoard({
  tiers,
  items,
  selectedId,
  dropTarget,
  draggedId,
  draggedItem,
  justPlacedId,
  layout,
  onRenameTier,
  onRemoveTier,
  onAddTier,
  onDropTargetChange,
  onDropTargetClear,
  onDrop,
  onPlaceSelected,
  onTileDragStart,
  onTileDragEnd,
  onTileSelect,
  onTileDelete,
  onTilePreview,
}: TierBoardProps) {
  const [contextMenu, setContextMenu] = useState<{ tierId: string; x: number; y: number } | null>(null);

  return (
    <div className={`min-w-0${layout === 'side-by-side' ? ' lg:basis-[var(--split)]' : ''}`}>
      <section className="grid gap-[7px]" aria-label="Tier ranking board">
        {tiers.map((tier, index) => (
          <TierRow
            key={tier.id}
            tier={tier}
            index={index}
            items={items.filter((item) => item.tierId === tier.id)}
            selectedId={selectedId}
            dropTarget={dropTarget}
            draggedId={draggedId}
            draggedItem={draggedItem}
            justPlacedId={justPlacedId}
            onRenameTier={onRenameTier}
            onRowDragOver={(tierId) => onDropTargetChange({ tierId })}
            onRowDragLeave={onDropTargetClear}
            onRowDrop={(event, tierId) => onDrop(event, tierId)}
            onRowClick={(tierId) => selectedId && onPlaceSelected(tierId)}
            onTileDragStart={(event, itemId) => {
              onTileDragStart(itemId);
              event.dataTransfer.setData('text/plain', itemId);
              event.dataTransfer.effectAllowed = 'move';
            }}
            onTileDragEnd={onTileDragEnd}
            onTileDragOver={(event, tierId, itemId) => {
              event.preventDefault();
              event.stopPropagation();
              onDropTargetChange({ tierId, beforeId: itemId });
            }}
            onTileDrop={(event, tierId, itemId) => onDrop(event, tierId, itemId)}
            onTileClick={(event, itemId) => {
              event.stopPropagation();
              onTileSelect(itemId);
            }}
            onTileDoubleClick={(event, itemId) => {
              event.stopPropagation();
              onTilePreview(itemId);
            }}
            onTileDelete={(event, itemId) => {
              event.stopPropagation();
              onTileDelete(itemId);
            }}
            onLabelContextMenu={(event, tierId) => setContextMenu({ tierId, x: event.clientX, y: event.clientY })}
          />
        ))}
      </section>

      <button
        className="mt-2.5 inline-flex items-center gap-2 rounded border border-dashed border-[#cbd2c8] bg-transparent px-3 py-2 text-[11px] text-[#748176] transition-colors hover:border-[#849c89] hover:bg-white hover:text-[#31513d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#62876e]"
        onClick={onAddTier}
      >
        <Icon name="plus" />
      </button>

      {contextMenu && (
        <ContextMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)}>
          <button
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] text-[#9a4a3b] transition-colors hover:bg-[#fbeceb]"
            onClick={() => {
              onRemoveTier(contextMenu.tierId);
              setContextMenu(null);
            }}
          >
            <Icon name="trash" /> Delete tier
          </button>
        </ContextMenu>
      )}
    </div>
  );
}
