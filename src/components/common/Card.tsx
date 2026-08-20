import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'rounded-xl bg-slate-900/70 border border-slate-800/80 p-5 shadow-subtle transition-all duration-200',
        hoverEffect && 'hover:border-slate-700 hover:bg-slate-900/90 hover:shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
