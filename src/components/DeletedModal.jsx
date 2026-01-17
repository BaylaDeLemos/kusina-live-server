import { useEffect } from "react";
import "./DeletedModal.css";

export default function DeletedModal({
  open,
  title,
  message,
  onClose,
  confirm = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  autoCloseMs = 2000,
}) {
  // Close modal when ESC key is pressed
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Auto-close notification modals after delay (skip for confirm dialogs)
  useEffect(() => {
    if (!open) return;
    if (confirm) return;

    const t = setTimeout(() => {
      onClose?.();
    }, autoCloseMs);

    return () => clearTimeout(t);
  }, [open, confirm, autoCloseMs, onClose]);

  if (!open) return null;

  const handleBackdrop = () => {
    // Prevent backdrop click from closing confirm modals for safety
    if (confirm) return;
    onClose?.();
  };

  return (
    <div className="sm-backdrop" onMouseDown={handleBackdrop}>
      <div
        className="sm-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title || "Modal"}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="sm-top">
          <div className="sm-text">
            {title ? <h3 className="sm-title">{title}</h3> : null}
            {message ? <p className="sm-message">{message}</p> : null}
          </div>

          {/* Close button only for notification modals */}
          {!confirm && (
            <button className="sm-x" type="button" onClick={onClose} aria-label="Close">
              ✕
            </button>
          )}
        </div>

        {/* Action buttons for confirm dialogs */}
        {confirm && (
          <div className="sm-actions">
            <button className="sm-btn sm-cancel" type="button" onClick={onClose}>
              {cancelText}
            </button>
            <button
              className="sm-btn sm-confirm"
              type="button"
              onClick={() => onConfirm?.()}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}