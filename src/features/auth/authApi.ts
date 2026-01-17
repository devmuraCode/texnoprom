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
  const res = await fetch(`${httpClient}/users/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data as IAuthData;
}

export async function registerApi(body: RegisterBody): Promise<unknown> {
  const res = await fetch(`${httpClient}/users/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
}
