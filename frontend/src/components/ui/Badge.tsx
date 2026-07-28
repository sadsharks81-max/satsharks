interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "accent";
  className?: string;
}

const variants = {
  default: "bg-surface-container-high text-on-surface",
  success: "bg-primary/20 text-primary",
  warning: "bg-accent/20 text-accent",
  error: "bg-error/20 text-error",
  info: "bg-secondary/20 text-secondary",
  accent: "bg-secondary-container text-on-secondary-container",
};

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-bold rounded-full ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
