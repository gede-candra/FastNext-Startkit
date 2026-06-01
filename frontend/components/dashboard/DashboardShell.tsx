"use client";

import { DashboardLayout } from "./DashboardLayout";

export function DashboardShell() {
  return (
    <DashboardLayout title="Dashboard">
      {({ user }) => (
        <section className="dashboardContent" aria-live="polite">
          <dl className="profileGrid">
            <div>
              <dt>Role</dt>
              <dd>{user.role.name}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{user.is_active ? "Aktif" : "Nonaktif"}</dd>
            </div>
          </dl>
        </section>
      )}
    </DashboardLayout>
  );
}
