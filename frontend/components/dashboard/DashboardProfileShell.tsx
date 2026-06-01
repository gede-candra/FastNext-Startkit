"use client";

import { DashboardLayout } from "./DashboardLayout";
import { DashboardProfileContent } from "./DashboardProfileContent";

export function DashboardProfileShell() {
  return (
    <DashboardLayout title="Profil Saya">
      {({ setUser, user }) => <DashboardProfileContent setUser={setUser} user={user} />}
    </DashboardLayout>
  );
}
