import React, { forwardRef, useState } from "react";
import classNames from "classnames";
import { Eye, EyeOff } from "lucide-react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;

  toUpper?: boolean;
  toLower?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, className, error, type, onChange, toUpper = false, toLower = false, ...rest }, ref) => {

    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const isPassword = type === "password";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      if (toUpper) value = value.toUpperCase();
      if (toLower) value = value.toLowerCase();

      e.target.value = value;

      // Marcamos si tiene texto
      const hasText = value.length > 0;
      setHasValue(hasText);

      if (hasText) {
        e.target.classList.add("has-text");
      } else {
        e.target.classList.remove("has-text");
      }

      if (onChange) onChange(e);
    };

    return (
      <div className="flex flex-col mb-3 w-full">
        {label && (
          <label htmlFor={rest.name} className="font-bold text-xs md:text-sm">
            {label}
          </label>
        )}

        <div className="relative w-full">
          <input
            spellCheck={true}
            lang="es"
            {...rest}
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            onChange={handleChange}
            className={classNames(
              `border-b border-dark-gray2 
               focus:outline-none focus:border-blue-500
               text-[10px] md:text-xs py-1 pr-1 w-full`,
              className,
              { "border-red text-xs md:text-sm": !!error,"cursor-pointer": type === "date",   }
            )}
          />

          {isPassword && hasValue && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
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

export default TextInput;
