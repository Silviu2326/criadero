import { cn } from '@/utils/cn';

interface TabsProps {
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ children, className }: TabsProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-1 bg-apple-gray rounded-xl p-1 overflow-x-auto">{children}</div>
    </div>
  );
}

interface TabProps {
  value: string;
  label: string;
  activeValue: string;
  onClick: (value: string) => void;
}

export function Tab({ value, label, activeValue, onClick }: TabProps) {
  const active = value === activeValue;
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
        active
          ? 'bg-white text-apple-blue shadow-sm'
          : 'text-apple-gray-200 hover:text-apple-black hover:bg-apple-gray-300/30'
      )}
    >
      {label}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  activeValue: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, activeValue, children, className }: TabPanelProps) {
  if (value !== activeValue) return null;
  return <div className={cn('animate-fade-in', className)}>{children}</div>;
}
