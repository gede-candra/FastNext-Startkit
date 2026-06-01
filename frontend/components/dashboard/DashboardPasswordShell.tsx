"use client";

import { DashboardLayout } from "./DashboardLayout";
import { DashboardPasswordContent } from "./DashboardPasswordContent";

export function DashboardPasswordShell() {
  return (
    <DashboardLayout title="Ubah Password">
      {({ user }) => <DashboardPasswordContent user={user} />}
    </DashboardLayout>
  );
}
