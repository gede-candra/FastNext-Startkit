"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getWelcomeTitle } from "../../lib/appBrand";
import { getCurrentUser, signIn } from "../../services/authService";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then(() => {
        if (isMounted) {
          router.replace("/dashboard");
        }
      })
      .catch(() => undefined);

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signIn(email, password);
      router.replace("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Login gagal.");
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

        <form className="authForm" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              autoComplete="email"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              autoComplete="current-password"
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimal 8 karakter"
              required
              type="password"
              value={password}
            />
          </label>

          {error ? <p className="formError">{error}</p> : null}

          <button disabled={isLoading} type="submit">
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
