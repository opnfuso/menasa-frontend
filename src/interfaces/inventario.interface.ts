import type { Medicamento } from "./medicamento.interface";

interface Lote {
  fecha_vencimiento: Date;
  fecha_vencimiento_string: string;
  fecha_ingreso: Date;
  cantidad: number;
  lote: string;
  observaciones: string;
}

export interface Inventario {
  _id: string;
  piezas: number;
  id_medicamento: Medicamento;
  lotes: Lote[];
}

export interface InventarioUpdate {
  _id: string;
  piezas: number;
  id_medicamento: string;
  lotes: Lote[];
}

export interface InventarioUpdateResponse {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: string;
  matchedCount: number;
}
