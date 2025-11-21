import React, { forwardRef, useState } from "react";
import classNames from "classnames";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  className?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, maxLength = 1500, className, ...rest }, ref) => {
    const [count, setCount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      rest.onChange?.(e);
    };

    return (
      <div className="flex flex-col mb-3 w-full">
        {label && (
          <label
            htmlFor={rest.name}
            className="font-bold text-xs md:text-sm"
          >
            {label}
          </label>
        )}

        <textarea
          {...rest}
          ref={ref}
          onChange={handleChange}
          spellCheck={true}       // 🔥 autocorrector
          autoCorrect="on"        // 🔥 autocorrección
          autoCapitalize="sentences" // 🔥 mayúscula automática
          className={classNames(
            `border border-dark-gray  rounded-lg scroll-t p-2!
             focus:outline-none focus:border-blue-500
             text-[10px] md:text-xs py-2 px-1 w-full min-h-[120px] resize-y`,
            className,
            { "border-red": !!error }
          )}
          maxLength={maxLength}
        />

        <div className="flex justify-between mt-1 scroll-t!">
          {error && (
            <span className="text-[10px] text-red">
              {error}
            </span>
          )}
          <span className="text-[10px] text-dark2-gray">
            {count}/{maxLength}
          </span>
        </div>
      </div>
    );
  }
);

export default TextArea;
