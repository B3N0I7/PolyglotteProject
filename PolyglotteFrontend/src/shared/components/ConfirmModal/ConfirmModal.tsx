import React from "react";
import type { ConfirmModalProps } from "./types";
import "./ConfirmModal.css";

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "info",
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header ${variant}`}>
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`btn btn-${variant === "danger" ? "danger" : "primary"}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "En cours..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
