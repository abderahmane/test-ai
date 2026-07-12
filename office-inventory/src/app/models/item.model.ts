export type ItemStatus =
  | 'In Stock'
  | 'Low Stock'
  | 'Out of Stock'
  | 'Under Repair';

export interface Item {
  id: number;
  name: string;
  category: string;
  quantity: number;
  location?: string | null;
  status: ItemStatus;
}

export interface ItemRequest {
  name: string;
  category: string;
  quantity: number;
  location?: string | null;
  status: ItemStatus;
}

export interface InventoryStats {
  totalItems: number;
  totalQuantity: number;
  lowStockCount: number;
  categoryCount: number;
}

export const ITEM_STATUSES: ItemStatus[] = [
  'In Stock',
  'Low Stock',
  'Out of Stock',
  'Under Repair',
];