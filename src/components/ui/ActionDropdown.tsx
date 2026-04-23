import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ActionItem {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}

interface ActionDropdownProps {
  actions: ActionItem[];
  className?: string;
}

export function ActionDropdown({ actions, className }: ActionDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(!open); }}
        className="p-2 rounded-lg hover:bg-apple-gray transition-colors"
      >
        <MoreVertical size={16} className="text-apple-gray-200" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-lg border border-apple-gray-300/50 z-20 py-1 animate-fade-in">
          {actions.map((action, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(false);
                action.onClick();
              }}
              className={cn(
                'w-full text-left px-4 py-2 text-sm hover:bg-apple-gray transition-colors',
                action.destructive ? 'text-red-600' : 'text-apple-black'
              )}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
