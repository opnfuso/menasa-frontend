import type { Inventario } from "./inventario.interface";
import type { Medicamento } from "./medicamento.interface";
import type Pedido from "./pedido.interface";
import type { User } from "./user.interface";

export interface Historial {
  _id: string;
  userId: string;
  category: string;
  action: string;
  createdAt: Date;
  createdAtString?: string;
  id_medicamento?: Medicamento;
  id_inventario?: Inventario;
  id_pedido?: Pedido;
  id_user?: User;
}
