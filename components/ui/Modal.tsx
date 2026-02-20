"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  message,
  children,
  className = "",
}: ModalProps) {
  const handleClose = onCancel ?? onClose ?? (() => {});

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  const isConfirmDialog = onConfirm !== undefined;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md bg-background border-2 border-border shadow-[6px_6px_0px_0px_hsl(0_0%_0%)] mx-4 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-border px-5 py-4">
          {title && (
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
          )}
          <button
            onClick={handleClose}
            className="ml-auto flex items-center justify-center w-8 h-8 border-2 border-border bg-background hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5 text-foreground">
          {message && <p className="text-muted-foreground">{message}</p>}
          {children}
        </div>

        {/* Confirm/Cancel Footer */}
        {isConfirmDialog && (
          <div className="flex gap-3 justify-end border-t-2 border-border px-5 py-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 border-2 border-border bg-background text-foreground font-semibold hover:bg-muted transition-colors shadow-[3px_3px_0px_0px_hsl(0_0%_0%)]"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 border-2 border-border bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-[3px_3px_0px_0px_hsl(0_0%_0%)]"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

