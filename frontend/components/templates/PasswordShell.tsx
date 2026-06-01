"use client";

import { AppLayout } from "../layouts/AppLayout";
import { DashboardPasswordContent } from "../organisms/dashboard/DashboardPasswordContent";

export function PasswordShell() {
  return (
    <AppLayout title="Ubah Password">
      {({ user }) => <DashboardPasswordContent user={user} />}
    </AppLayout>
  );
}
