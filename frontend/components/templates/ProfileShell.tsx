"use client";

import { AppLayout } from "../layouts/AppLayout";
import { DashboardProfileContent } from "../organisms/dashboard/DashboardProfileContent";

export function ProfileShell() {
  return (
    <AppLayout title="Profil Saya">
      {({ setUser, user }) => <DashboardProfileContent setUser={setUser} user={user} />}
    </AppLayout>
  );
}
