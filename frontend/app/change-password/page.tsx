import type { Metadata } from "next";
import { PasswordShell } from "../../components/templates/PasswordShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ubah Password",
};

export default function ChangePasswordPage() {
  return <PasswordShell />;
}
