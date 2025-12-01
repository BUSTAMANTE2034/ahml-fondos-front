import React from "react";
import classNames from "classnames";

interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
}

const FormCheckbox = ({
  label,
  error,
  className,
  ...rest
}: FormCheckboxProps) => {
  return (
    <div className="flex flex-col mb-3 w-full">
      {label && (
        <label className="font-bold text-xs md:text-sm mb-1">
          {label}
        </label>
      )}

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          className={classNames(
            "w-4 h-4 cursor-pointer accent-blue-600",
            className
          )}
          {...rest}
        />

        {rest.placeholder && (
          <span className="text-[10px] md:text-xs text-dark-gray2">
            {rest.placeholder}
          </span>
        )}
      </div>

      {error && (
        <span className="mt-1 text-[10px] text-red">
          {error}
        </span>
      )}
    </div>
  );
};

export default FormCheckbox;
