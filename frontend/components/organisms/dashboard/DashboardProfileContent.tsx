"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { TextInput } from "../../atoms/TextInput";
import { FormStatusToast, type FormStatusToastState } from "../../molecules/FormStatusToast";
import { updateCurrentUser } from "../../../services/authService";
import type { AuthUser } from "../../../types/auth";
import { ProfileSettingsLayout } from "./ProfileSettingsLayout";

type ProfileFieldErrors = {
  email?: string;
  name?: string;
};

type DashboardProfileContentProps = {
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  user: AuthUser;
};

export function DashboardProfileContent({ setUser, user }: DashboardProfileContentProps) {
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [statusDialog, setStatusDialog] = useState<FormStatusToastState | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    setProfileName(user.name);
    setProfileEmail(user.email);
  }, [user]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors = validateProfileForm(profileName, profileEmail);

    setStatusDialog(null);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsUpdatingProfile(true);

    try {
      const updatedUser = await updateCurrentUser({
        name: profileName.trim(),
        email: profileEmail.trim(),
      });
      setUser(updatedUser);
      setStatusDialog({
        description: "Perubahan profil berhasil disimpan.",
        title: "Profil berhasil disimpan",
        variant: "success",
      });
    } catch (caughtError) {
      setStatusDialog({
        description: caughtError instanceof Error ? caughtError.message : "Gagal menyimpan profil.",
        title: "Gagal menyimpan profil",
        variant: "error",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  return (
    <ProfileSettingsLayout activeItem="profile" user={user}>
      <form className="profileForm" noValidate onSubmit={handleProfileSubmit}>
        <TextInput
          error={fieldErrors.name}
          label="Nama"
          name="name"
          onChange={(event) => setProfileName(event.target.value)}
          placeholder="Nama lengkap"
          value={profileName}
        />
        <TextInput
          error={fieldErrors.email}
          label="Email"
          name="email"
          onChange={(event) => setProfileEmail(event.target.value)}
          placeholder="email@domain.com"
          type="email"
          value={profileEmail}
        />

        <div className="formActions">
          <button disabled={isUpdatingProfile} type="submit">
            {isUpdatingProfile ? "Menyimpan..." : "Simpan profil"}
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

function validateProfileForm(name: string, email: string): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  if (!name.trim()) {
    errors.name = "Nama wajib diisi.";
  }

  if (!email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!isValidEmail(email)) {
    errors.email = "Format email tidak valid.";
  }

  return errors;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
