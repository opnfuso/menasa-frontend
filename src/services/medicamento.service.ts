import type Medicamento from "@/interfaces/medicamento.interface";
import type { AxiosResponse } from "axios";
import axios from "./axios";

export const getMedicamentos = async (): Promise<AxiosResponse<Medicamento[]>> =>
  await axios.get("/medicamento");

export const getMedicamento = async (
  id: string
): Promise<AxiosResponse<Medicamento>> => await axios.get(`/medicamento/${id}`);
