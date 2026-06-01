"use client";

import { useEffect } from "react";

import { Icon } from "./Icon";

const AUTO_CLOSE_MS = 10000;

export type FormStatusDialogState = {
  description: string;
  title: string;
  variant: "error" | "success";
};

type FormStatusDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  status: FormStatusDialogState | null;
};

export function FormStatusDialog({ isOpen, onClose, status }: FormStatusDialogProps) {
  useEffect(() => {
    if (!isOpen || !status) {
      return undefined;
    }

    const timeoutId = window.setTimeout(onClose, AUTO_CLOSE_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isOpen, onClose, status]);

  if (!isOpen || !status) {
    return null;
  }

  const title = status.variant === "success" ? "Sukses" : status.title;

  return (
    <div className="statusToastRegion" role="presentation">
      <section
        aria-live="assertive"
        className={`statusDialog ${status.variant}`}
        key={`${status.variant}-${status.title}-${status.description}`}
        role={status.variant === "error" ? "alert" : "status"}
      >
        <div className="statusDialogHeader">
          <span className="statusDialogIcon" aria-hidden="true">
            <Icon className="statusDialogMark" name={status.variant === "success" ? "check" : "x"} />
          </span>
          <div className="statusDialogBody">
            <h2 className="statusDialogTitle">{title}</h2>
            <p className="statusDialogDescription">{status.description}</p>
          </div>
          <button aria-label="Tutup popup" className="statusDialogClose" onClick={onClose} type="button">
            <Icon className="menuIcon" name="x" />
          </button>
        </div>
        <span className="statusDialogTimer" aria-hidden="true" />
      </section>
    </div>
  );
}
