import type { Historial } from "@/interfaces/historial.interface";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "./axios";

export const getHistorial = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse<Historial[]>> => await axios.get("/historial", config);
