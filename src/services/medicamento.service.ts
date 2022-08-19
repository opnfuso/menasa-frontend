import type {
  Medicamento,
  MedicamentoUpdateResponse,
} from "@/interfaces/medicamento.interface";
import type { AxiosResponse } from "axios";
import axios from "./axios";

export const getMedicamentos = async (): Promise<
  AxiosResponse<Medicamento[]>
> => await axios.get("/medicamento");

export const getMedicamento = async (
  id: string
): Promise<AxiosResponse<Medicamento>> => await axios.get(`/medicamento/${id}`);

export const updateMedicamento = async (
  id: string,
  medicamento: Medicamento
): Promise<AxiosResponse<MedicamentoUpdateResponse>> =>
  await axios.patch(`medicamento/${id}`, medicamento);
