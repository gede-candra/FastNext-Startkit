"use client";

import { useEffect, useState } from "react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_PREFIX || "/api";
const appName = process.env.NEXT_PUBLIC_APP_NAME || "Starter App";

type BackendStatus = {
  status: string;
  detail: string;
};

export default function HomePage() {
  const [backend, setBackend] = useState<BackendStatus>({
    status: "checking",
    detail: "Checking backend connection...",
  });

  useEffect(() => {
    let mounted = true;

    const checkBackend = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/v1/health`, { cache: "no-store" });

        if (!mounted) {
          return;
        }

        if (!response.ok) {
          setBackend({ status: "unreachable", detail: `HTTP ${response.status}` });
          return;
        }

        const data = (await response.json()) as { status?: string; service?: string };
        setBackend({
          status: data.status ?? "unknown",
          detail: data.service ?? "Unknown service",
        });
      } catch {
        if (!mounted) {
          return;
        }
        setBackend({ status: "unreachable", detail: "Backend is not running" });
      }
    };

    checkBackend();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="page">
      <section className="card">
        <p className="eyebrow">Starter Kit</p>
        <h1>Welcome to {appName}</h1>
        <p className="subtitle">Boilerplate FastAPI + Next.js untuk proyek web apa pun.</p>

        <div className="statusRow">
          <span className={`statusDot ${backend.status === "ok" ? "ok" : "down"}`} />
          <div>
            <p className="statusTitle">Backend status: {backend.status}</p>
            <p className="statusDetail">{backend.detail}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
