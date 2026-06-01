import type { Metadata } from "next";
import { DashboardShell } from "../components/templates/DashboardShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <DashboardShell />;
}
