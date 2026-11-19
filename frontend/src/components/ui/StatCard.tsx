import React from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'emerald',
  onClick,
}) => {
  const colorMap = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-500/10 text-emerald-700',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-100',
      iconBg: 'bg-amber-500/10 text-amber-700',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-100',
      iconBg: 'bg-rose-500/10 text-rose-700',
    },
    sky: {
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-100',
      iconBg: 'bg-sky-500/10 text-sky-700',
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-500/10 text-indigo-700',
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm shadow-gray-200/50 flex flex-col justify-between transition-all duration-200 min-w-0 overflow-hidden',
        onClick && 'cursor-pointer hover:border-gray-300 hover:shadow-md'
      )}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider truncate">{title}</p>
          <h4 className="text-lg sm:text-2xl font-bold text-gray-900 mt-1 tracking-tight truncate">{value}</h4>
        </div>
        <div className={clsx('p-2 sm:p-2.5 rounded-xl shrink-0', scheme.iconBg)}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-gray-50">
          {subtitle && <span className="text-gray-500">{subtitle}</span>}
          {trend && (
            <span
              className={clsx(
                'font-bold px-1.5 py-0.5 rounded-md',
                trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              )}
            >
              {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const Avatar: React.FC<{
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ src, name, size = 'md', className }) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={clsx('rounded-full object-cover ring-2 ring-white shadow-sm', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        'rounded-full bg-primary-100 text-primary-800 font-bold flex items-center justify-center ring-2 ring-white shadow-sm shrink-0',
        sizeMap[size],
        className
      )}
    >
      {initials}
    </div>
  );
};
