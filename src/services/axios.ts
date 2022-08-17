import axios, { type AxiosInstance } from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
