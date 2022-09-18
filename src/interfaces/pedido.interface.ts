import type { Inventario } from "./inventario.interface";

interface Medicamento {
  piezas: number;
  precio_maximo: number;
  precio_sugerido: number;
  descuento: number;
  precio_total: number;
  id_inventario: Inventario;
}

export default interface Pedido {
  _id: string;
  cliente: string;
  completado: boolean;
  fecha_salida: Date;
  fecha_entrada: Date;
  medicamentos: Medicamento[];
}

export interface PedidoUpdate {
  _id: string;
  cliente: string;
  completado: boolean;
  fecha_salida: Date;
  fecha_entrada: Date;
  medicamento: Medicamento[];
}

export interface PedidoUpdateResponse {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: string;
  matchedCount: number;
}

export interface PedidoCreate {
  cliente: string;
  completado: boolean;
  fecha_salida: Date;
  fecha_entrada: Date;
  medicamentos: Medicamento[];
}
