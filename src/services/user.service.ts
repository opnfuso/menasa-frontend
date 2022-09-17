import type { User, UserCreate, UserUpdate } from "@/interfaces/user.interface";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "./axios";

export const getUsers = async (
  config: AxiosRequestConfig
): Promise<AxiosResponse<User[]>> => await axios.get("/user", config);

export const getUser = async (
  id: string,
  config: AxiosRequestConfig
): Promise<AxiosResponse<User>> => await axios.get(`/user/${id}`, config);

export const updateUser = async (
  id: string,
  user: UserUpdate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<User>> =>
  await axios.patch(`user/${id}`, user, config);

export const createUser = async (
  user: UserCreate,
  config: AxiosRequestConfig
): Promise<AxiosResponse<User>> => await axios.post("/user", user, config);

export const deleteUser = async (
  id: string,
  config: AxiosRequestConfig
): Promise<any> => await axios.delete(`/user/${id}`, config);
