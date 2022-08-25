import type {
  Medicamento,
  MedicamentoUpdateResponse,
  MedicamentoCreate,
} from "@/interfaces/medicamento.interface";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "./axios";

export const getMedicamentos = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse<Medicamento[]>> =>
  await axios.get("/medicamento", config);

export const getMedicamento = async (
  id: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse<Medicamento>> =>
  await axios.get(`/medicamento/${id}`, config);

export const updateMedicamento = async (
  id: string,
  medicamento: Medicamento,
  config: AxiosRequestConfig
): Promise<AxiosResponse<MedicamentoUpdateResponse>> =>
  await axios.patch(`medicamento/${id}`, medicamento, config);

export const createMedicamento = async (
  medicamento: MedicamentoCreate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<Medicamento>> =>
  await axios.post("/medicamento", medicamento, config);
