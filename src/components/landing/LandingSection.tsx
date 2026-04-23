import { cn } from '@/utils/cn';
import { type ReactNode } from 'react';

interface LandingSectionProps {
  children: ReactNode;
  className?: string;
  variant?: 'light' | 'mid' | 'dark';
  id?: string;
}

const variantMap = {
  light: 'bg-white',
  mid: 'aurora-mid',
  dark: 'aurora-dark noise-overlay-dark',
};

export function LandingSection({ children, className, variant = 'light', id }: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative py-20 lg:py-28 overflow-hidden',
        variantMap[variant],
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
}
