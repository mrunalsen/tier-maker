import { useRef } from 'react';
import { BoardHeading } from './components/BoardHeading';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { ResizeHandle } from './components/ResizeHandle';
import { TierBoard } from './components/TierBoard';
import { Toolbar } from './components/Toolbar';
import { UnrankedTray } from './components/UnrankedTray';
import { SPLIT_MAX, SPLIT_MIN, useTierBoard } from './hooks/useTierBoard';

function App() {
  const board = useTierBoard();
  const paneContainerRef = useRef<HTMLDivElement>(null);
  const isSideBySide = board.layout === 'side-by-side';

  return (
    <main className="min-h-screen bg-[#f7f7f2] font-sans text-sm font-normal text-[#26372d] antialiased selection:bg-[#d9e6ce] selection:text-[#1e3427]">
      <section className="mx-auto max-w-[1180px] p-3" id="top">
        <BoardHeading title={board.title} onTitleChange={board.setTitle} />

        <div
          ref={paneContainerRef}
          className={`flex flex-col gap-4 md:gap-6${isSideBySide ? ' lg:flex-row lg:items-start lg:gap-0' : ''}`}
          style={{ '--split': `${board.splitPercent}%` } as React.CSSProperties}
        >
          <TierBoard
            tiers={board.tiers}
            items={board.items}
            selectedId={board.selectedId}
            dropTarget={board.dropTarget}
            draggedId={board.draggedId}
            draggedItem={board.draggedItem}
            justPlacedId={board.justPlacedId}
            layout={board.layout}
            onRenameTier={board.renameTier}
            onRemoveTier={board.removeTier}
            onAddTier={board.addTier}
            onDropTargetChange={board.setDropTarget}
            onDropTargetClear={board.clearDropTarget}
            onDrop={board.handleDrop}
            onPlaceSelected={(tierId) => board.selectedId && board.placeItem(board.selectedId, tierId)}
            onTileDragStart={board.startDrag}
            onTileDragEnd={board.endDrag}
            onTileSelect={board.selectItem}
            onTileDelete={board.removeItem}
            onTilePreview={board.openPreview}
          />

          {isSideBySide && (
            <ResizeHandle
              containerRef={paneContainerRef}
              value={board.splitPercent}
              min={SPLIT_MIN}
              max={SPLIT_MAX}
              onChange={board.setSplitPercent}
            />
          )}

          <UnrankedTray
            items={board.unranked}
            selectedId={board.selectedId}
            dropTarget={board.dropTarget}
            draggedId={board.draggedId}
            draggedItem={board.draggedItem}
            justPlacedId={board.justPlacedId}
            layout={board.layout}
            fileInput={board.fileInput}
            onUpload={board.handleUpload}
            onDropTargetChange={board.setDropTarget}
            onDropTargetClear={board.clearDropTarget}
            onDrop={(event, beforeId) => board.handleDrop(event, null, beforeId)}
            onPlaceSelected={() => board.selectedId && board.placeItem(board.selectedId, null)}
            onTileDragStart={board.startDrag}
            onTileDragEnd={board.endDrag}
            onTileSelect={board.selectItem}
            onTileDelete={board.removeItem}
            onTilePreview={board.openPreview}
          />
        </div>

        <Toolbar
          layout={board.layout}
          onReset={board.resetBoard}
          onToggleLayout={board.toggleLayout}
        />

        <footer className="mt-[31px] flex justify-between gap-4 border-t border-[#e2e5dc] pt-[13px] text-[10px] text-[#9ba49a]">
          <span className="text-[9px] font-bold tracking-[0.9px]">MADE FOR DEBATES THAT MATTER</span>
          <span>Now go defend your S-tier.</span>
        </footer>
      </section>

      <ImagePreviewModal item={board.previewItem} onClose={board.closePreview} />
    </main>
  );
}

export default App;
