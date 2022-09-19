import type {
  PedidoCreate,
  PedidoUpdate,
  PedidoUpdateResponse,
} from "@/interfaces/pedido.interface";
import type { Pedido } from "@/interfaces/pedido.interface";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "./axios";

export const getPedidos = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse<Pedido[]>> => await axios.get("/pedidos", config);

export const getPedido = async (
  id: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse<Pedido>> => await axios.get(`/pedidos/${id}`, config);

export const updatePedido = async (
  id: string,
  pedido: PedidoUpdate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<PedidoUpdateResponse>> =>
  await axios.patch(`pedidos/${id}`, pedido, config);

export const createPedido = async (
  pedido: PedidoCreate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<Pedido>> =>
  await axios.post("/pedidos", pedido, config);
