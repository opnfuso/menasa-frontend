import type { ReceiveMessage } from "@/interfaces/chat.interface";

import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "./axios";

export const getMessages = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse<ReceiveMessage[]>> => await axios.get("/chat", config);
