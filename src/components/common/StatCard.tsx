import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  link?: {
    to: string;
    label: string;
  };
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'slate';
  className?: string;
  loading?: boolean;
  variant?: 'default' | 'bento' | 'compact';
  sparkline?: number[];
}

const colorMap = {
  blue: {
    bg: 'bg-[#F2F5F4]',
    text: 'text-[#4A5D52]',
    icon: 'text-[#4A5D52]',
    border: 'border-[#D2DCD7]',
    gradient: 'from-[#4A5D52] to-[#5A7D6E]',
    soft: 'text-[#4A5D52]/80',
    spark: '#4A5D52',
  },
  green: {
    bg: 'bg-[#E3EDE8]',
    text: 'text-[#5A7D6E]',
    icon: 'text-[#5A7D6E]',
    border: 'border-[#C9DBD3]',
    gradient: 'from-[#5A7D6E] to-[#4A5D52]',
    soft: 'text-[#5A7D6E]/80',
    spark: '#5A7D6E',
  },
  orange: {
    bg: 'bg-[#FAEBE4]',
    text: 'text-[#B87B5C]',
    icon: 'text-[#B87B5C]',
    border: 'border-[#F5D6C8]',
    gradient: 'from-[#B87B5C] to-[#C9A227]',
    soft: 'text-[#B87B5C]/80',
    spark: '#B87B5C',
  },
  purple: {
    bg: 'bg-[#F1EBE5]',
    text: 'text-[#8B7355]',
    icon: 'text-[#8B7355]',
    border: 'border-[#E3D8CC]',
    gradient: 'from-[#8B7355] to-[#B87B5C]',
    soft: 'text-[#8B7355]/80',
    spark: '#8B7355',
  },
  red: {
    bg: 'bg-[#F3E5E5]',
    text: 'text-[#A14E4E]',
    icon: 'text-[#A14E4E]',
    border: 'border-[#E7CCCC]',
    gradient: 'from-[#A14E4E] to-[#8B4242]',
    soft: 'text-[#A14E4E]/80',
    spark: '#A14E4E',
  },
  slate: {
    bg: 'bg-[#E8E4DC]',
    text: 'text-[#6B6560]',
    icon: 'text-[#6B6560]',
    border: 'border-[#DCD7CF]',
    gradient: 'from-[#6B6560] to-[#4A4640]',
    soft: 'text-[#6B6560]/80',
    spark: '#6B6560',
  },
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 64;
  const height = 28;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        className="sparkline"
        style={{ stroke: color }}
      />
    </svg>
  );
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  link,
  color = 'blue',
  className,
  loading = false,
  variant = 'default',
  sparkline,
}: StatCardProps) {
  const colors = colorMap[color];

  if (loading) {
    return (
      <div className={cn('bento-card p-5 animate-pulse', className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <div className="skeleton h-3 w-20"></div>
            <div className="skeleton h-7 w-16"></div>
          </div>
          <div className="skeleton w-10 h-10 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('bento-card p-4 flex items-center gap-4', className)}>
        <div
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br',
            colors.gradient
          )}
        >
          <Icon size={20} className="text-[#FDFCFA]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-apple-gray-100 mb-0.5">
            {title}
          </p>
          <p className="text-xl font-display font-bold text-[var(--apple-black)] tracking-tight">
            {value}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden transition-all duration-300',
        variant === 'bento' ? 'bento-card p-5 glow-blue' : 'card p-5',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-apple-gray-100 mb-1">
            {title}
          </p>
          <p className="text-2xl font-display font-bold text-[var(--apple-black)] tracking-tight">
            {value}
          </p>

          {trend && (
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold',
                  trend.positive !== false
                    ? 'bg-[#E8F0EC] text-[#4A5D52]'
                    : 'bg-[#F3E5E5] text-[#A14E4E]'
                )}
              >
                {trend.positive !== false ? (
                  <TrendingUp size={10} />
                ) : (
                  <TrendingDown size={10} />
                )}
                {Math.abs(trend.value)}%
              </span>
              <span className="text-[11px] text-apple-gray-100">{trend.label}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={cn(
              'flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-br shadow-md',
              colors.gradient
            )}
          >
            <Icon size={22} className="text-[#FDFCFA]" />
          </div>
          {sparkline && (
            <Sparkline data={sparkline} color={colors.spark} />
          )}
        </div>
      </div>

      {link && (
        <Link
          to={link.to}
          className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-[var(--apple-link)] hover:text-[#5A7D6E] transition-colors group/link"
        >
          {link.label}
          <ArrowUpRight
            size={12}
            className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
          />
        </Link>
      )}
    </div>
  );
}

// Mini stat card for compact layouts
export function MiniStatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  className,
}: Omit<StatCardProps, 'link' | 'sparkline'>) {
  const colors = colorMap[color];

  return (
    <div className={cn('bento-card p-4 flex items-center gap-4', className)}>
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br',
          colors.gradient
        )}
      >
        <Icon size={20} className="text-[#FDFCFA]" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-apple-gray-100">{title}</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-[var(--apple-black)]">{value}</p>
          {trend && (
            <span
              className={cn(
                'flex items-center text-xs',
                trend.positive !== false ? 'text-[#5A7D6E]' : 'text-[#A14E4E]'
              )}
            >
              {trend.positive !== false ? (
                <ArrowUpRight size={12} />
              ) : (
                <ArrowDownRight size={12} />
              )}
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
