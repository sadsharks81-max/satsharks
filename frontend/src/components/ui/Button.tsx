import { ReactNode } from "react";
import { Icon } from "../common/Icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost" | "glass";
  icon?: string;
}

export function Button({ children, variant = "primary", icon, className = "", ...props }: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors";
  
  const variants = {
    primary: "btn-shimmer bg-primary text-on-primary shark-shadow hover:bg-primary-container",
    outline: "border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low",
    ghost: "bg-transparent text-primary hover:bg-primary/10",
    glass: "bg-white/15 text-white hover:bg-white/25",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
      {icon && <Icon name={icon} className="text-[18px]" />}
    </button>
  );
}
