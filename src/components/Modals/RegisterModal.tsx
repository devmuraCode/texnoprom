"use client";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

import Modal from "./Modal";
import Input from "../Input/Input";
import Heading from "../Heading/Heading";

import useRegisterModal from "@/hooks/useRegisterModal";
import useLoginModal from "@/hooks/useLoginModal";
import useForgotPasswordModal from "@/hooks/useForgotPassword";
import useVerify_phoneModal from "@/hooks/useVerify_phoneModal";

import { useRegister } from "@/features/auth/useAuth";

type Inputs = {
  username: string;
  password: string;
  phone_number: string;
};

function pickMsg(err: any) {
  return (
    err?.detail ||
    err?.message ||
    err?.data?.detail ||
    err?.data?.message ||
    "Ошибка. Попробуйте ещё раз"
  );
}

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const forgotPasswordModal = useForgotPasswordModal();
  const verifycationModal = useVerify_phoneModal();

  const [isLoading, setIsLoading] = useState(false);

  const registerMut = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      await registerMut.mutateAsync({
        username: data.username,
        phone_number: data.phone_number,
        password: data.password,
      });
      localStorage.setItem("phone_number", data.phone_number);

      toast.success("Код отправлен ✅");
      registerModal.onClose();
      verifycationModal.onOpen();
    } catch (error: any) {
      toast.error(pickMsg(error));
    } finally {
      setIsLoading(false);
    }
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Добро пожаловать в Технопром"
        subtitle="Завести аккаунт!"
      />

      <Input
        id="username"
        name="username"
        label="Имя пользователя"
        disabled={isLoading}
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
        register={register}
        errors={errors}
        required
      />

      <Input
        id="phone_number"
        name="phone_number"
        label="Номер телефона"
        type="tel"
        disabled={isLoading}
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
          У вас уже есть аккаунт?
          <span
            onClick={() => {
              loginModal.onOpen();
              registerModal.onClose();
            }}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {" "}
            Войти
          </span>
        </p>

        <p>
          Забыли пароль?
          <span
            onClick={() => {
              forgotPasswordModal.onOpen();
              registerModal.onClose();
            }}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {" "}
            Восстановить
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Регистрация"
      actionLabel={isLoading ? "Подождите..." : "Продолжить"}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
