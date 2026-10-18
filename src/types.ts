export type Tier = { id: string; name: string; color: string }
export type ListItem = { id: string; name: string; image: string; tierId: string | null }
export type DropTarget = { tierId: string | null; beforeId?: string }
