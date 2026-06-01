"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { PasswordInput } from "../../atoms/PasswordInput";
import { FormStatusToast, type FormStatusToastState } from "../../molecules/FormStatusToast";
import { updateCurrentUser } from "../../../services/authService";
import type { AuthUser } from "../../../types/auth";
import { ProfileSettingsLayout } from "./ProfileSettingsLayout";

type PasswordFieldErrors = {
  currentPassword?: string;
  password?: string;
  passwordConfirmation?: string;
};

type DashboardPasswordContentProps = {
  user: AuthUser;
};

export function DashboardPasswordContent({ user }: DashboardPasswordContentProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [fieldErrors, setFieldErrors] = useState<PasswordFieldErrors>({});
  const [statusDialog, setStatusDialog] = useState<FormStatusToastState | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors = validatePasswordForm(currentPassword, password, passwordConfirmation);

    setStatusDialog(null);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsUpdating(true);
    try {
      await updateCurrentUser({ current_password: currentPassword, password });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setStatusDialog({
        description: "Password akun berhasil diperbarui.",
        title: "Password berhasil disimpan",
        variant: "success",
      });
    } catch (caughtError) {
      const errorMessage = caughtError instanceof Error ? caughtError.message : "Gagal memperbarui password.";
      if (errorMessage.toLowerCase().includes("password lama")) {
        setFieldErrors({ currentPassword: errorMessage });
      } else {
        setStatusDialog({
          description: errorMessage,
          title: "Gagal menyimpan password",
          variant: "error",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <ProfileSettingsLayout activeItem="password" user={user}>
      <form className="profileForm" noValidate onSubmit={handleSubmit}>
        <PasswordInput
          autoComplete="current-password"
          error={fieldErrors.currentPassword}
          label="Password lama"
          name="currentPassword"
          onChange={(event) => setCurrentPassword(event.target.value)}
          placeholder="Masukkan password lama"
          value={currentPassword}
        />
        <PasswordInput
          autoComplete="new-password"
          error={fieldErrors.password}
          label="Password baru"
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimal 8 karakter"
          value={password}
        />
        <PasswordInput
          autoComplete="new-password"
          error={fieldErrors.passwordConfirmation}
          label="Konfirmasi password baru"
          name="passwordConfirmation"
          onChange={(event) => setPasswordConfirmation(event.target.value)}
          placeholder="Ulangi password baru"
          value={passwordConfirmation}
        />

        <div className="formActions">
          <button disabled={isUpdating} type="submit">
            {isUpdating ? "Menyimpan..." : "Simpan password"}
          </button>
        </div>
      </form>
      <FormStatusToast
        isOpen={statusDialog !== null}
        onClose={() => setStatusDialog(null)}
        status={statusDialog}
      />
    </ProfileSettingsLayout>
  );
}

function validatePasswordForm(
  currentPassword: string,
  password: string,
  passwordConfirmation: string,
): PasswordFieldErrors {
  const errors: PasswordFieldErrors = {};

  if (!currentPassword) {
    errors.currentPassword = "Password lama wajib diisi.";
  }

  if (!password) {
    errors.password = "Password baru wajib diisi.";
  } else if (password.length < 8) {
    errors.password = "Password baru minimal 8 karakter.";
  }

  if (!passwordConfirmation) {
    errors.passwordConfirmation = "Konfirmasi password wajib diisi.";
  } else if (password !== passwordConfirmation) {
    errors.passwordConfirmation = "Konfirmasi password tidak sama.";
  }

  return errors;
}
