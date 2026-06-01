"use client";

import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { ConfirmDialog } from "../molecules/ConfirmDialog";
import { clearToken, getCurrentUser } from "../../services/authService";
import type { AuthUser } from "../../types/auth";
import { Header } from "./Header";
import { PageHeading } from "./PageHeading";
import { Sidebar } from "./Sidebar";

type AppLayoutProps = {
  children: (context: {
    setUser: Dispatch<SetStateAction<AuthUser | null>>;
    user: AuthUser;
  }) => ReactNode;
  title: string;
};

export function AppLayout({ children, title }: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
          setIsCheckingSession(false);
        }
      })
      .catch(() => {
        void clearToken().catch(() => undefined);
        if (isMounted) {
          setIsCheckingSession(false);
        }
        router.replace("/login");
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleLogout() {
    try {
      await clearToken();
    } finally {
      router.replace("/login");
    }
  }

  function handleRequestLogout() {
    setIsAccountMenuOpen(false);
    setIsLogoutDialogOpen(true);
  }

  function handleViewProfile() {
    setIsAccountMenuOpen(false);
    router.push("/profile");
  }

  function handleChangePassword() {
    setIsAccountMenuOpen(false);
    router.push("/change-password");
  }

  function handleToggleSidebar() {
    setIsSidebarCollapsed((isCollapsed) => !isCollapsed);
    setIsSidebarMobileOpen((isOpen) => !isOpen);
  }

  const initials =
    user?.name
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";
  const breadcrumbItems = getBreadcrumbItems(pathname, title);

  if (isCheckingSession || !user) {
    return (
      <main className="sessionLoadingPage" aria-live="polite">
        <p>Memeriksa sesi...</p>
      </main>
    );
  }

  return (
    <main
      className={`dashboardPage${isSidebarCollapsed ? " sidebarCollapsed" : ""}${
        isSidebarMobileOpen ? " sidebarMobileOpen" : ""
      }`}
    >
      <Sidebar activePath={pathname} isCollapsed={isSidebarCollapsed} />

      <div className="dashboardMain">
        <Header
          initials={initials}
          isAccountMenuOpen={isAccountMenuOpen}
          isPasswordPage={pathname === "/change-password"}
          isProfilePage={pathname === "/profile"}
          onChangePassword={handleChangePassword}
          onLogout={handleRequestLogout}
          onToggleAccountMenu={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
          onToggleSidebar={handleToggleSidebar}
          onViewProfile={handleViewProfile}
          user={user}
        />

        <div className="dashboardContentArea">
          <PageHeading items={breadcrumbItems} title={title} />
          {children({ setUser, user })}
        </div>
      </div>

      <ConfirmDialog
        confirmLabel="Logout"
        description="Tindakan ini akan menutup akses masuk Anda saat ini, apakah Anda yakin ingin mengakhiri sesi Anda saat ini?"
        isOpen={isLogoutDialogOpen}
        onCancel={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Yakin Ingin Keluar?"
      />
    </main>
  );
}

function getBreadcrumbItems(pathname: string, title: string) {
  const items: Array<{ href?: string; label: string }> = [{ href: "/", label: "Dashboard" }];

  if (pathname === "/") {
    return [{ label: "Dashboard" }];
  }

  if (pathname === "/profile") {
    items.push({ label: "Akun" });
    items.push({ label: "Profil Saya" });
    return items;
  }

  if (pathname === "/change-password") {
    items.push({ label: "Akun" });
    items.push({ label: "Ubah Password" });
    return items;
  }

  if (items[items.length - 1]?.label !== title) {
    items.push({ label: title });
  }

  return items;
}
