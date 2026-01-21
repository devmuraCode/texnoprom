"use client";

import { useCallback, useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useRegisterModal from "@/hooks/useRegisterModal";

import Modal from "./Modal";
import Input from "../Input/Input";
import Heading from "../Heading/Heading";
import { httpClient } from "@/httpClient/httpClient";
import useLoginModal from "@/hooks/useLoginModal";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);

    try {
      const res = await httpClient.post("/users/login/", data);
      localStorage.setItem("token", res.data.access);
      localStorage.setItem("user_id", res.data.user_id);

      toast.success("Вы успешно вошли в аккаунт");

      loginModal.onClose();

      router.refresh();
    } catch (err: any) {
      toast.error("Неверный логин или пароль");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onToggle = useCallback(() => {
    loginModal.onClose();
    registerModal.onOpen();
  }, [loginModal, registerModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Добро пожаловать" subtitle="Войдите в аккаунт" />

      <Input
        id="username"
        name="username"
        label="Имя пользователя"
        disabled={isLoading}
        // @ts-ignore
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        name="password"
        label="Пароль"
        type="password"
        disabled={isLoading}
        // @ts-ignore
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <p>
          Впервые пользуетесь Технопромом?
          <span
            onClick={onToggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {" "}
            Завести аккаунт
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Вход"
      actionLabel="Войти"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
