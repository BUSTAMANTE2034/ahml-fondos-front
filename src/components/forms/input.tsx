import get from "lodash/get";
import { ReactNode } from "react";
import { DeepMap, FieldError, FieldValues, Path, RegisterOptions, UseFormRegister } from "react-hook-form";
import TextInput from "./text"; 
import classNames from "classnames";
import { FieldErrors } from "react-hook-form";

export type FormInputProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  rules?: RegisterOptions<TFormValues, Path<TFormValues>>;
  register?: UseFormRegister<TFormValues>;
  errors?: FieldErrors<TFormValues>;
  inputClassName?: string;
  label?: string;
  right?: ReactNode;
  border?: boolean;
  toUpper?: boolean;
  toLower?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

export const FormInput = <TFormValues extends FieldValues>({
  name,
  register,
  rules,
  errors,
  className,
  inputClassName,
  label,
  ...props
}: FormInputProps<TFormValues>) => {
  const errorMessages = get(errors, name);
  const hasError = !!(errors && errorMessages);

  return (
    <div className={classNames("", className)} aria-live="polite">
      <TextInput
        {...props}
          inputMode={props.type === "number" ? "numeric" : undefined}
  pattern={props.type === "number" ? "[0-9]*" : undefined}
        toUpper={props.toUpper}
        toLower={props.toLower}
        name={name}
        label={label}
        error={hasError ? (errorMessages as unknown as FieldError)?.message : ""}
        className={inputClassName}
        {...(register && register(name, rules))}
      />
    </div>
  );
};
