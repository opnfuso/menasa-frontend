import type Inventario from "@/interfaces/inventario.interface";
import type { AxiosResponse } from "axios";
import axios from "./axios";

export const getInventarios = async (): Promise<AxiosResponse<Inventario[]>> =>
  await axios.get("/inventario");