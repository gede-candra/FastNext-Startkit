"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PasswordInput } from "../../atoms/PasswordInput";
import { TextInput } from "../../atoms/TextInput";
import { FormStatusToast, type FormStatusToastState } from "../../molecules/FormStatusToast";
import { getWelcomeTitle } from "../../../lib/appBrand";
import { getCurrentUser, signIn } from "../../../services/authService";

type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [statusDialog, setStatusDialog] = useState<FormStatusToastState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then(() => {
        if (isMounted) {
          router.replace("/");
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors = validateLoginForm(email, password);

    setStatusDialog(null);
    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      router.replace("/");
    } catch (caughtError) {
      setStatusDialog({
        description: caughtError instanceof Error ? caughtError.message : "Login gagal.",
        title: "Login gagal",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="authPage">
      <section className="authPanel" aria-labelledby="login-title">
        <img className="brandLogo" src="/fastnext-logo.png" alt={`${getWelcomeTitle()} logo`} />
        <h1 id="login-title">{getWelcomeTitle()}</h1>
        <p className="authSubtitle">Silakan masuk menggunakan akun Anda untuk mulai menjelajah.</p>

        <form className="authForm" noValidate onSubmit={handleSubmit}>
          <TextInput
            autoComplete="email"
            error={fieldErrors.email}
            label="Email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
            type="email"
            value={email}
          />

          <PasswordInput
            autoComplete="current-password"
            error={fieldErrors.password}
            label="Password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Minimal 8 karakter"
            value={password}
          />

          <button disabled={isLoading} type="submit">
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
      </section>
      <FormStatusToast
        isOpen={statusDialog !== null}
        onClose={() => setStatusDialog(null)}
        status={statusDialog}
      />
    </main>
  );
}

function validateLoginForm(email: string, password: string): LoginFieldErrors {
  const errors: LoginFieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!isValidEmail(email)) {
    errors.email = "Format email tidak valid.";
  }

  if (!password) {
    errors.password = "Password wajib diisi.";
  }

  return errors;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
