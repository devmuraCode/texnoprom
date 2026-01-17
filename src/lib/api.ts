import { tokenStore, type Tokens } from "./authTokens";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type ApiError = { status: number; data: unknown };

async function refreshTokens(): Promise<Tokens> {
  const refresh = tokenStore.getRefresh();
  if (!refresh) throw new Error("No refresh token");

  const res = await fetch(`${API_URL}/users/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  const data = (await res.json()) as any;
  if (!res.ok) throw new Error("Refresh failed");

  // ВНИМАНИЕ: если бэк возвращает другой формат — подправь тут
  // ожидаем { access, refresh } или { access }.
  const tokens: Tokens = {
    access: data.access,
    refresh: data.refresh ?? refresh,
  };

  tokenStore.set(tokens);
  return tokens;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { auth?: boolean }
): Promise<T> {
  const auth = init?.auth ?? true;
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");

  if (auth) {
    const access = tokenStore.getAccess();
    if (access) headers.set("Authorization", `Bearer ${access}`);
  }

  let res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (res.status === 401 && auth) {
    await refreshTokens();
    const access2 = tokenStore.getAccess();
    const headers2 = new Headers(headers);
    if (access2) headers2.set("Authorization", `Bearer ${access2}`);
    res = await fetch(`${API_URL}${path}`, { ...init, headers: headers2 });
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err: ApiError = { status: res.status, data };
    throw err;
  }
  return data as T;
}
