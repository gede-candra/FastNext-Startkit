import Link from "next/link";

import { getAppName } from "../../lib/appBrand";
import { Icon } from "../common/Icon";

type DashboardSidebarProps = {
  activePath: string;
  isCollapsed: boolean;
};

const navigationItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
  },
];

export function DashboardSidebar({ activePath, isCollapsed }: DashboardSidebarProps) {
  const appName = getAppName();

  return (
    <aside className="dashboardSidebar" aria-label="Navigasi utama">
      <Link className="sidebarBrand" href="/dashboard" aria-label={`${appName} dashboard`}>
        <img className="sidebarLogo" src="/fastnext-logo.png" alt="" />
        <span className="visuallyHidden">{appName}</span>
      </Link>

      <nav className="sidebarNav">
        {navigationItems.map((item) => {
          const isActive = activePath === item.href;

          return (
            <Link
              className={`sidebarNavItem${isActive ? " active" : ""}`}
              href={item.href}
              key={item.href}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="menuIcon" name="dashboard" />
              <span className="sidebarNavLabel">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
