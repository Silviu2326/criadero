import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    to: string;
    icon?: LucideIcon;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('card p-12 text-center', className)}>
      <div className="w-20 h-20 bg-apple-gray rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="text-apple-gray-300" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-apple-black mb-2">{title}</h3>
      <p className="text-apple-gray-100 max-w-md mx-auto mb-6">{description}</p>
      {action && (
        <Link to={action.to} className="btn-primary inline-flex items-center gap-2">
          {action.icon && <action.icon size={18} />}
          {action.label}
        </Link>
      )}
    </div>
  );
}
