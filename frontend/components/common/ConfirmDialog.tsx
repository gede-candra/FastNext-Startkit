import { Icon } from "./Icon";

type ConfirmDialogProps = {
  confirmLabel?: string;
  description: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
};

export function ConfirmDialog({
  confirmLabel = "Konfirmasi",
  description,
  isOpen,
  onCancel,
  onConfirm,
  title,
}: ConfirmDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalBackdrop" role="presentation">
      <section
        aria-describedby="confirm-dialog-description"
        aria-labelledby="confirm-dialog-title"
        aria-modal="true"
        className="confirmDialog"
        role="alertdialog"
      >
        <div className="confirmDialogHeader">
          <h2 id="confirm-dialog-title">{title}</h2>
          <button aria-label="Tutup dialog" className="iconButton" onClick={onCancel} type="button">
            <Icon className="menuIcon" name="x" />
          </button>
        </div>
        <p id="confirm-dialog-description">{description}</p>
        <div className="confirmDialogActions">
          <button className="secondaryButton" onClick={onCancel} type="button">
            Batal
          </button>
          <button className="dangerButton" onClick={onConfirm} type="button">
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
