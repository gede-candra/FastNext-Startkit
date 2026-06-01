"use client";

import { useEffect, useState } from "react";

import { getBackendStatus, getInitialBackendStatus } from "../../services/healthService";
import type { BackendStatus } from "../../types/home";

type BackendStatusCardProps = {
  apiPrefix: string;
};

export function BackendStatusCard({ apiPrefix }: BackendStatusCardProps) {
  const [backend, setBackend] = useState<BackendStatus>(getInitialBackendStatus);

  useEffect(() => {
    let mounted = true;

    const checkBackend = async () => {
      const status = await getBackendStatus(apiPrefix);

      if (mounted) {
        setBackend(status);
      }
    };

    checkBackend();

    return () => {
      mounted = false;
    };
  }, [apiPrefix]);

  const isOk = backend.status === "ok";

  return (
    <article className="statusPanel">
      <div>
        <p className="eyebrow">Live API</p>
        <h2>Backend status</h2>
      </div>
      <div className="statusRow">
        <span className={`statusDot ${isOk ? "ok" : "down"}`} />
        <div>
          <p className="statusTitle">{backend.status}</p>
          <p className="statusDetail">{backend.detail}</p>
          {backend.environment ? <p className="statusDetail">Environment: {backend.environment}</p> : null}
        </div>
      </div>
    </article>
  );
}
