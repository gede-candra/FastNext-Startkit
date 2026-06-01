import type { Metadata } from "next";
import { LoginForm } from "../../components/organisms/auth/LoginForm";
import { getWelcomeTitle } from "../../lib/appBrand";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: getWelcomeTitle(),
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
