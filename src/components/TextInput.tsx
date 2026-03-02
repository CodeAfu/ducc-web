import { HTMLAttributes } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { cn } from "~/lib/utils";

interface TextInputProps<T extends FieldValues>
  extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  name?: Path<T>;
  placeholder?: string;
  inputClassName?: string;
  labelClassName?: string;
  register?: UseFormRegister<T>;
}

export default function TextInput<T extends FieldValues>({
  label,
  name,
  children,
  className,
  inputClassName,
  labelClassName,
  placeholder,
  register,
  ...props
}: TextInputProps<T>) {
  return (
    <div
      className={cn(
        "flex relative gap-4 items-center w-fit flex-nowrap",
        className
      )}
      {...props}
    >
      {label && (
        <label
          className={cn(
            "block text-xs text-primary select-none font-semibold absolute -top-2.5 left-4",
            labelClassName
          )}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        {...(register && name ? register(name) : {})}
        name={name}
        type="text"
        placeholder={placeholder}
        className={cn(
          "bg-slate-900 caret-primary-foreground md:text-xl sm:text-base text-sm font-medium rounded px-3 py-2 w-full focus:shadow focus:ring-1 focus:ring-ring focus:outline-none",
          inputClassName
        )}
      />
    </div>
  );
}
