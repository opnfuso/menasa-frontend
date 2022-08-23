import type {
  Inventario,
  InventarioUpdateResponse,
  InventarioUpdate,
  InventarioCreate,
} from "@/interfaces/inventario.interface";
import type { AxiosResponse } from "axios";
import axios from "./axios";

export const getInventarios = async (): Promise<AxiosResponse<Inventario[]>> =>
  await axios.get("/inventario");

export const getInventario = async (
  id: string
): Promise<AxiosResponse<Inventario>> => await axios.get(`/inventario/${id}`);

export const updateInventario = async (
  id: string,
  inventario: InventarioUpdate
): Promise<AxiosResponse<InventarioUpdateResponse>> =>
  axios.patch(`/inventario/${id}`, inventario);

export const createInventario = async (
  inventario: InventarioCreate
): Promise<AxiosResponse<Inventario>> =>
  await axios.post("/inventario", inventario);
