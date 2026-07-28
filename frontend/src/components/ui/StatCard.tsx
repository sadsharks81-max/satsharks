import { Icon } from "../common/Icon";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: "primary" | "accent" | "secondary" | "error";
}

const colorMap = {
  primary: "text-primary",
  accent: "text-accent",
  secondary: "text-secondary",
  error: "text-error",
};

export function StatCard({ label, value, icon, color = "primary" }: StatCardProps) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-6 border border-outline-variant/40 shark-shadow hover-lift">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-on-surface-variant text-sm mb-1">{label}</div>
          <div className={`text-3xl font-bold ${colorMap[color]}`}>{value}</div>
        </div>
        <div className="h-10 w-10 rounded-lg bg-primary-fixed flex items-center justify-center">
          <Icon name={icon} className={`text-[22px] ${colorMap[color]}`} />
        </div>
      </div>
    </div>
  );
}
