import type { ChangeEventHandler, HTMLInputTypeAttribute } from "react";

type TextInputProps = {
  autoComplete?: string;
  error?: string;
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value: string;
};

export function TextInput({
  autoComplete,
  error,
  label,
  name,
  onChange,
  placeholder,
  type = "text",
  value,
}: TextInputProps) {
  const errorId = error ? `${name}-error` : undefined;

  return (
    <label className="formField">
      <span>{label}</span>
      <input
        aria-describedby={errorId}
        aria-invalid={error ? "true" : "false"}
        autoComplete={autoComplete}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {error ? (
        <small className="fieldError" id={errorId}>
          {error}
        </small>
      ) : null}
    </label>
  );
}
