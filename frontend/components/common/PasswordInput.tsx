"use client";

import type { ChangeEventHandler } from "react";
import { useState } from "react";

import { Icon } from "./Icon";

type PasswordInputProps = {
  autoComplete?: string;
  error?: string;
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  value: string;
};

export function PasswordInput({
  autoComplete,
  error,
  label,
  name,
  onChange,
  placeholder,
  value,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const errorId = error ? `${name}-error` : undefined;

  return (
    <label className="formField">
      <span>{label}</span>
      <span className="passwordField">
        <input
          aria-describedby={errorId}
          aria-invalid={error ? "true" : "false"}
          autoComplete={autoComplete}
          name={name}
          onChange={onChange}
          placeholder={placeholder}
          type={isVisible ? "text" : "password"}
          value={value}
        />
        <button
          aria-label={isVisible ? "Sembunyikan password" : "Tampilkan password"}
          className="passwordToggle"
          onClick={() => setIsVisible((currentValue) => !currentValue)}
          title={isVisible ? "Sembunyikan password" : "Tampilkan password"}
          type="button"
        >
          <Icon className="menuIcon" name={isVisible ? "eyeOff" : "eye"} />
        </button>
      </span>
      {error ? (
        <small className="fieldError" id={errorId}>
          {error}
        </small>
      ) : null}
    </label>
  );
}
