import type { Metadata } from "next";
import { ProfileShell } from "../../components/templates/ProfileShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profil Saya",
};

export default function ProfilePage() {
  return <ProfileShell />;
}
