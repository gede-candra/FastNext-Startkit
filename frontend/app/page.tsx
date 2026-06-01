import type { Metadata } from "next";
import { LoginForm } from "../components/auth/LoginForm";
import { getWelcomeTitle } from "../lib/appBrand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: getWelcomeTitle(),
  },
};

export default function HomePage() {
  return <LoginForm />;
}
