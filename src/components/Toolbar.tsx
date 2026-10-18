import type { BoardLayout } from '../hooks/useTierBoard';
import { Icon } from './Icon';

type ToolbarProps = {
  layout: BoardLayout;
  onReset: () => void;
  onToggleLayout: () => void;
};

const buttonClasses =
  'inline-flex flex-1 items-center justify-start gap-1.5 rounded border border-transparent px-1.5 py-1.5 text-[11px] text-[#526056] transition-colors hover:border-[#dce1d8] hover:bg-white hover:text-[#233c2e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#62876e] md:flex-none md:justify-center md:gap-2 md:px-2.5 md:py-2 md:text-xs';

export function Toolbar({ layout, onReset, onToggleLayout }: ToolbarProps) {
  return (
    <div className="mt-6 flex min-h-[48px] animate-rise-in flex-col items-start gap-0.5 border-y border-[#e2e5dc] py-1.5 md:mt-[29px] md:flex-row md:items-center md:justify-between md:gap-3.5 md:py-0" aria-label="Board actions">
      <div className="flex w-full items-center gap-1.5 md:w-auto">
        <button className={buttonClasses} onClick={onReset}>
          <Icon name="reset" /> Reset board
        </button>
        <button className={buttonClasses} onClick={onToggleLayout}>
          <Icon name="layout" /> {layout === 'stacked' ? 'Side-by-side view' : 'Stacked view'}
        </button>
      </div>
    </div>
  );
}
