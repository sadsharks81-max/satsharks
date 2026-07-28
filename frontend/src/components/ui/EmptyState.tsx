import { Icon } from "../common/Icon";

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 border border-dashed border-outline-variant/60 rounded-2xl bg-surface-container-lowest">
      <Icon name={icon} className="text-5xl text-on-surface-variant/40 mb-4" />
      <h3 className="text-lg font-semibold text-on-surface mb-1">{title}</h3>
      {description && <p className="text-sm text-on-surface-variant mb-6">{description}</p>}
      {action}
    </div>
  );
}
