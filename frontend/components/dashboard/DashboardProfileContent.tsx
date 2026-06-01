"use client";

import type { Dispatch, FormEvent, SetStateAction } from "react";
import { useEffect, useState } from "react";

import { updateCurrentUser } from "../../services/authService";
import type { AuthUser } from "../../types/auth";
import { ProfileSettingsLayout } from "./ProfileSettingsLayout";

type DashboardProfileContentProps = {
  setUser: Dispatch<SetStateAction<AuthUser | null>>;
  user: AuthUser;
};

export function DashboardProfileContent({ setUser, user }: DashboardProfileContentProps) {
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    setProfileName(user.name);
    setProfileEmail(user.email);
  }, [user]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileMessage(null);
    setProfileError(null);
    setIsUpdatingProfile(true);

    try {
      const updatedUser = await updateCurrentUser({
        name: profileName.trim(),
        email: profileEmail.trim(),
      });
      setUser(updatedUser);
      setProfileMessage("Profil berhasil disimpan.");
    } catch (caughtError) {
      setProfileError(caughtError instanceof Error ? caughtError.message : "Gagal menyimpan profil.");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  return (
    <ProfileSettingsLayout activeItem="profile" user={user}>
      <form className="profileForm" onSubmit={handleProfileSubmit}>
        <label>
          <span>Nama</span>
          <input
            value={profileName}
            onChange={(event) => setProfileName(event.target.value)}
            placeholder="Nama lengkap"
            required
            type="text"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            value={profileEmail}
            onChange={(event) => setProfileEmail(event.target.value)}
            placeholder="email@domain.com"
            required
            type="email"
          />
        </label>

        {profileMessage ? <p className="formSuccess">{profileMessage}</p> : null}
        {profileError ? <p className="formError">{profileError}</p> : null}

        <div className="formActions">
          <button disabled={isUpdatingProfile} type="submit">
            {isUpdatingProfile ? "Menyimpan..." : "Simpan profil"}
          </button>
        </div>
      </form>
    </ProfileSettingsLayout>
  );
}
