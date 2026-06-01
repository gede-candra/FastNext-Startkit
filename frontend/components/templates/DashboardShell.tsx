"use client";

import { AppLayout } from "../layouts/AppLayout";

export function DashboardShell() {
  return (
    <AppLayout title="Dashboard">
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
    </AppLayout>
  );
}
