export default interface Medicamento {
  _id: string;
  codigo_barras: number;
  precio: number;
  nombre: string;
  compuesto_activo: string;
  laboratorio: string;
}
