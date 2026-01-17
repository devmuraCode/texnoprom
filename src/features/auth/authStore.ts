import { create } from "zustand";
import type { IAuthData, IAuthSchema } from "./types";

const LS_KEY = "auth";

type AuthState = IAuthSchema & {
  setLoading: (v: boolean) => void;
  setError: (msg?: string) => void;
  setSuccess: (v: boolean) => void;
  setUserInfo: (data: IAuthData | null) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  userInfo: null,
  isLoading: false,
  error: undefined,
  success: false,

  setLoading: (v) => set({ isLoading: v }),
  setError: (msg) => set({ error: msg }),
  setSuccess: (v) => set({ success: v }),

  setUserInfo: (data) => {
    set({ userInfo: data });
    if (typeof window !== "undefined") {
      if (data) localStorage.setItem(LS_KEY, JSON.stringify(data));
      else localStorage.removeItem(LS_KEY);
    }
  },

  logout: () => {
    get().setUserInfo(null);
    set({ success: false, error: undefined, isLoading: false });
  },

  hydrate: () => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw) as IAuthData;
      if (data?.access && data?.refresh) set({ userInfo: data });
    } catch {
      localStorage.removeItem(LS_KEY);
    }
  },
}));
