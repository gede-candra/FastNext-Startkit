"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { updateCurrentUser } from "../../services/authService";
import type { AuthUser } from "../../types/auth";
import { ProfileSettingsLayout } from "./ProfileSettingsLayout";

type DashboardPasswordContentProps = {
  user: AuthUser;
};

export function DashboardPasswordContent({ user }: DashboardPasswordContentProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setIsUpdating(true);
    try {
      await updateCurrentUser({ current_password: currentPassword, password });
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirmation("");
      setMessage("Password berhasil diperbarui.");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Gagal memperbarui password.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <ProfileSettingsLayout activeItem="password" user={user}>
      <form className="profileForm" onSubmit={handleSubmit}>
        <label>
          <span>Password lama</span>
          <input
            autoComplete="current-password"
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Masukkan password lama"
            required
            type="password"
            value={currentPassword}
          />
        </label>
        <label>
          <span>Password baru</span>
          <input
            autoComplete="new-password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimal 8 karakter"
            required
            type="password"
            value={password}
          />
        </label>
        <label>
          <span>Konfirmasi password baru</span>
          <input
            autoComplete="new-password"
            minLength={8}
            onChange={(event) => setPasswordConfirmation(event.target.value)}
            placeholder="Ulangi password baru"
            required
            type="password"
            value={passwordConfirmation}
          />
        </label>

        {message ? <p className="formSuccess">{message}</p> : null}
        {error ? <p className="formError">{error}</p> : null}

        <div className="formActions">
          <button disabled={isUpdating} type="submit">
            {isUpdating ? "Menyimpan..." : "Simpan password"}
          </button>
        </div>
      </form>
    </ProfileSettingsLayout>
  );
}
