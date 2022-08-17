interface lotes {
  fecha_vencimiento: Date;
  fecha_ingreso: Date;
  cantidad: number;
  lote: string;
}

export default interface Inventario {
  _id: string;
  observaciones: string;
  piezas: number;
  id_medicamento: string;
  lotes: Array<lotes>;
}
