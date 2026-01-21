"use client";

import { useCallback, useState } from "react";
import { useForm, type FieldValues, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { httpClient } from "@/httpClient/httpClient";

import Heading from "../Heading/Heading";
import Input from "../Input/Input";
import Modal from "./Modal";

import useVerify_phoneModal from "@/hooks/useVerify_phoneModal";

const Verify_phoneModal = () => {
  const verifycationModal = useVerify_phoneModal();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const phoneNumber =
      typeof window !== "undefined"
        ? localStorage.getItem("phone_number")
        : null;

    setIsLoading(true);

    const payload = {
      ...data,
      phone_number: phoneNumber || data.phone_number,
    };

    try {
      const res = await httpClient.post("/users/verify-phone/", payload);

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("user_id", res.data.user_id);

      toast.success("Телефон подтверждён ✅");

      verifycationModal.onClose();

      router.refresh();
    } catch (err: any) {
      console.error("verify error:", err);
      toast.error("Неверный код или ошибка верификации");
    } finally {
      setIsLoading(false);
    }
  };

  const onToggle = useCallback(() => {
    verifycationModal.onClose();
  }, [verifycationModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Смс верификация"
        subtitle="Введите код, который пришёл на телефон"
      />

      <Input
        id="verification_code"
        name="verification_code"
        label="Код подтверждения"
        type="text"
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
          Продолжить дальше?
          <span
            onClick={onToggle}
            className="text-neutral-800 cursor-pointer hover:underline"
          >
            {" "}
            Ок
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={verifycationModal.isOpen}
      title="Смс верификация"
      actionLabel={isLoading ? "Проверяем..." : "Продолжить"}
      onClose={verifycationModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default Verify_phoneModal;
