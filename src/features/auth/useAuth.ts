import { useMutation } from "@tanstack/react-query";
import {
  loginApi,
  registerApi,
  type LoginBody,
  type RegisterBody,
} from "./authApi";

import { useAuthStore } from "@/features/auth/authStore";

function pickErrorMessage(err: any) {
  return (
    err?.data?.detail ||
    err?.data?.message ||
    err?.detail ||
    err?.message ||
    "Ошибка"
  );
}

export function useLogin() {
  const setUserInfo = useAuthStore((s) => s.setUserInfo);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setError = useAuthStore((s) => s.setError);
  const setSuccess = useAuthStore((s) => s.setSuccess);

  return useMutation({
    mutationFn: (body: LoginBody) => loginApi(body),
    onMutate: () => {
      setLoading(true);
      setError(undefined);
      setSuccess(false);
    },
    onSuccess: (data) => {
      setUserInfo(data);
      setSuccess(true);
    },
    onError: (err) => setError(pickErrorMessage(err)),
    onSettled: () => setLoading(false),
  });
}

export function useRegister() {
  const setLoading = useAuthStore((s) => s.setLoading);
  const setError = useAuthStore((s) => s.setError);
  const setSuccess = useAuthStore((s) => s.setSuccess);

  return useMutation({
    mutationFn: (body: RegisterBody) => registerApi(body),
    onMutate: () => {
      setLoading(true);
      setError(undefined);
      setSuccess(false);
    },
    onSuccess: () => setSuccess(true),
    onError: (err) => setError(pickErrorMessage(err)),
    onSettled: () => setLoading(false),
  });
}
