import type {
  PedidoCreate,
  PedidoUpdate,
  PedidoUpdateResponse,
} from "@/interfaces/pedido.interface";
import type Pedido from "@/interfaces/pedido.interface";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "./axios";

export const getPedidos = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse<Pedido[]>> => await axios.get("/pedido", config);

export const getPedido = async (
  id: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse<Pedido>> => await axios.get(`/pedido/${id}`, config);

export const updatePedido = async (
  id: string,
  pedido: PedidoUpdate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<PedidoUpdateResponse>> =>
  await axios.patch(`pedido/${id}`, pedido, config);

export const createPedido = async (
  pedido: PedidoCreate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<Pedido>> =>
  await axios.post("/medicamento", pedido, config);
