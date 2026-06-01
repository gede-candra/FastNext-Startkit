import type { Metadata } from "next";
import { DashboardProfileShell } from "../../components/dashboard/DashboardProfileShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil Saya",
};

export default function ProfilePage() {
  return <DashboardProfileShell />;
}
