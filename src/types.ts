export type MoveStatus = 'pending' | 'moved';

export interface Pedestal {
  id: string;
  userName: string; // 經辦同仁 / 負責人
  customerId: string; // 目前客戶編號 (例如 CUST-0001, C10001)
  oldCode: string; // 舊抽屜代號 (例如 A區#1-1, B區#2-3)
  newCode: string; // 新抽屜代號 (例如 (GT1181)A區#1-1)
  newLocation?: string; // 新位置 (例如 A區#1-1, B區#8-5)
  zone: string; // "A區", "B區", "C區"
  colIndex: number; // 縱向欄位編號 (由左至右 1, 2, 3...)
  slotIndex: number; // 欄內層位 (由上至下 1, 2, 3...)
  row: number; // 垂直層位 (= slotIndex)
  col: number; // 縱向欄位 (= colIndex)
  oldZone: string;
  oldRow: number;
  oldCol: number;
  status: MoveStatus;
  notes?: string;
  updatedAt?: string;
}

export interface ZoneInfo {
  id: string;
  name: string;
  description: string;
  color: string;
  totalColumns: number;
  columnSlots: number[]; // [7, 6, 6...]
  totalSlots: number;
}

export interface SearchFilter {
  query: string;
  zone: string;
  status: string; // 'all' | 'pending' | 'moved'
  userName: string;
  customerId?: string;
}

export interface MovementStats {
  total: number;
  moved: number;
  pending: number;
  percentage: number;
}
