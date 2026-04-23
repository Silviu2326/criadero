import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Breadcrumb[];
  action?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bento';
}

export function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  action,
  className,
  variant = 'default',
}: PageHeaderProps) {
  if (variant === 'bento') {
    return (
      <div className={cn('mb-8', className)}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-apple-black tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-apple-gray-100 mt-2 text-base font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('mb-8', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-apple-gray-100 mb-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 hover:text-apple-blue transition-colors"
          >
            <Home size={14} />
            <span className="sr-only">Dashboard</span>
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              <ChevronRight size={14} />
              {crumb.path ? (
                <Link
                  to={crumb.path}
                  className="hover:text-apple-blue transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-apple-black">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-section font-display font-semibold text-apple-black">
            {title}
          </h1>
          {subtitle && (
            <p className="text-apple-gray-100 mt-1 text-body">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
