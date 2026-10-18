import type { ListItem } from '../types';

export function GhostTile({ item }: { item: ListItem }) {
  return (
    <div
      className="h-[64px] w-[88px] flex-none overflow-hidden rounded opacity-40 ring-2 ring-dashed ring-[#8fac94] sm:h-[70px] sm:w-[103px]"
      aria-hidden="true"
    >
      <img className="h-full w-full object-cover" src={item.image} alt="" />
    </div>
  );
}
