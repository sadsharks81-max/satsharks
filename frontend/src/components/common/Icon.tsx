import { HTMLAttributes } from "react";

export const Icon = ({ name, className = "", ...props }: { name: string; className?: string } & HTMLAttributes<HTMLSpanElement>) => (
  <span className={`material-symbols-outlined ${className}`} {...props}>{name}</span>
);
