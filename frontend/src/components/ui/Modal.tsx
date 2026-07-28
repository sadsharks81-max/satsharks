import { ReactNode } from "react";
import { Icon } from "../common/Icon";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, icon, children, maxWidth = "max-w-lg" }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`bg-surface-container-lowest border border-outline-variant/65 rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] md:max-h-[85vh] p-6 relative flex flex-col`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-low transition-colors z-10"
        >
          <Icon name="close" className="text-2xl" />
        </button>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 pr-8 shrink-0">
          {icon && <Icon name={icon} className="text-primary" />}
          <span className="truncate">{title}</span>
        </h2>
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}