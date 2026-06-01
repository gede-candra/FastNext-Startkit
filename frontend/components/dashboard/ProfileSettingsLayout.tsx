import Link from "next/link";
import type { ReactNode } from "react";

import type { AuthUser } from "../../types/auth";
import { Icon } from "../common/Icon";

type ProfileSettingsLayoutProps = {
  activeItem: "profile" | "password";
  children: ReactNode;
  user: AuthUser;
};

export function ProfileSettingsLayout({ activeItem, children, user }: ProfileSettingsLayoutProps) {
  const initials =
    user.name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <section className="profileSettingsGrid" aria-live="polite">
      <aside className="profileSettingsSidebar">
        <div className="profilePhoto" aria-hidden="true">
          {initials}
        </div>
        <div className="profileSidebarIdentity">
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>

        <nav className="profileSettingsNav" aria-label="Menu profil">
          <Link className={activeItem === "profile" ? "active" : undefined} href="/profile">
            <Icon className="menuIcon" name="user" />
            <span>Profil Saya</span>
          </Link>
          <Link className={activeItem === "password" ? "active" : undefined} href="/change-password">
            <Icon className="menuIcon" name="key" />
            <span>Ubah Password</span>
          </Link>
        </nav>
      </aside>

      <section className="dashboardContent profileSettingsPanel">{children}</section>
    </section>
  );
}
