import type { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps<T extends FieldValues> {
  id: string;
  name: keyof T & string;
  label: string;
  type?: string;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
}

const Input = <T extends Record<string, any>>({
  id,
  label,
  name,
  type = "text",
  disabled,
  formatPrice,
  register,
  required,
  errors,
}: InputProps<T>) => {
  const hasError = !!errors?.[name];

  return (
    <div className="w-full relative">
      <input
        id={id}
        disabled={disabled}
        {...register(name, { required })}
        placeholder=" "
        type={type}
        className={`
          peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition
          disabled:opacity-70 disabled:cursor-not-allowed
          ${formatPrice ? "pl-9" : "pl-4"}
          ${hasError ? "border-rose-500" : "border-neutral-300"}
          ${hasError ? "focus:border-rose-500" : "focus:border-black"}
        `}
      />

      <label
        htmlFor={id}
        className={`
          absolute text-md duration-150 transform -translate-y-3 top-5 z-10 origin-[0]
          ${formatPrice ? "left-9" : "left-4"}
          peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
          peer-focus:scale-75 peer-focus:-translate-y-4
          ${hasError ? "text-rose-500" : "text-zinc-400"}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default Input;
