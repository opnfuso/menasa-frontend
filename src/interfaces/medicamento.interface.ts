export interface Medicamento {
  _id: string;
  codigo_barras: number;
  precio: number;
  nombre: string;
  compuesto_activo: string;
  laboratorio: string;
}

export interface MedicamentoUpdateResponse {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedCount: number;
  upsertedId: string;
  matchedCount: number;
}

export interface MedicamentoCreate {
  codigo_barras: number;
  precio: number;
  nombre: string;
  compuesto_activo: string;
  laboratorio: string;
}
