interface lotes {
  fecha_vencimiento: Date;
  fecha_ingreso: Date;
  cantidad: number;
  lote: string;
}

export interface inventario {
  _id: string;
  observaciones: string;
  piezas: number;
  id_medicamento: string;
  lostes: Array<lotes>;
}
