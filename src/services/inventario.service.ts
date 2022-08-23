import type {
  Inventario,
  InventarioUpdateResponse,
  InventarioUpdate,
  InventarioCreate,
} from "@/interfaces/inventario.interface";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "./axios";

export const getInventarios = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse<Inventario[]>> =>
  await axios.get("/inventario", config);

export const getInventario = async (
  id: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse<Inventario>> =>
  await axios.get(`/inventario/${id}`, config);

export const updateInventario = async (
  id: string,
  inventario: InventarioUpdate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<InventarioUpdateResponse>> =>
  axios.patch(`/inventario/${id}`, inventario, config);

export const createInventario = async (
  inventario: InventarioCreate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<Inventario>> =>
  await axios.post("/inventario", inventario, config);
