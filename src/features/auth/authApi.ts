import type { IAuthData } from "./types";
import { httpClient } from "@/httpClient/httpClient";

export type LoginBody = {
  phone_number: string;
  password: string;
};

export type RegisterBody = {
  username: string;
  phone_number: string;
  password: string;
};

export async function loginApi(body: LoginBody): Promise<IAuthData> {
  const { data } = await httpClient.post<IAuthData>("/users/login/", body);
  return data;
}

export async function registerApi(body: RegisterBody): Promise<unknown> {
  const { data } = await httpClient.post("/users/register/", body);
  return data;
}
