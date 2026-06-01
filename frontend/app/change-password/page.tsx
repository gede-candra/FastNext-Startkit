import type { Metadata } from "next";
import { DashboardPasswordShell } from "../../components/dashboard/DashboardPasswordShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ubah Password",
};

export default function ChangePasswordPage() {
  return <DashboardPasswordShell />;
}
