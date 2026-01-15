import React, { useEffect } from "react";
import { X as CloseIcon } from "lucide-react";
import "./modalWarning.css";

interface ModalWarningProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  autoCloseTime?: number;
}

export const ModalWarning: React.FC<ModalWarningProps> = ({
  isOpen,
  onClose,
  title = "Warning",
  message,
  autoCloseTime = 3000,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseTime);

    return () => clearTimeout(timer);
  }, [isOpen, autoCloseTime, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-card warning">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-btn" onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};
