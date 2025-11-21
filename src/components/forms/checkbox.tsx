import React, { forwardRef } from "react";
import classNames from "classnames";
import { Path, UseFormRegister, FieldValues, RegisterOptions } from "react-hook-form";

interface FormCheckboxProps<TFormValues extends FieldValues> 
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name: Path<TFormValues>;
  label?: string;
  error?: string;
  register: UseFormRegister<TFormValues>;
  rules?: RegisterOptions<TFormValues>;
  className?: string;
}

const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps<any>>(
  ({ name, label, register, rules, error, className, ...rest }, ref) => {
    return (
      <div className="flex flex-col mb-3 w-full">
        {label && (
          <label
            htmlFor={name}
            className="font-bold text-xs md:text-sm mb-1"
          >
            {label}
          </label>
        )}

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register(name, rules)}
            ref={ref}
            {...rest}
            className={classNames(
              "w-4 h-4 cursor-pointer accent-blue-600",
              className
            )}
          />

          <span className="text-[10px] md:text-xs text-dark-gray2">
            {rest.placeholder}
          </span>
        </div>

        {error && (
          <span className="mt-1 text-[10px] text-red transition-opacity duration-300">
            {error}
          </span>
        )}
      </div>
    );
  }
);

export default FormCheckbox;
