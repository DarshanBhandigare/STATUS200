import React from 'react';
import { Layers, Globe, Eye } from 'lucide-react';
import { Portfolio } from '@/types/portfolio';

export const StatsBar: React.FC<{ portfolios: Portfolio[] }> = ({ portfolios }) => {
  const totalPortfolios = portfolios.length;
  const publishedCount = portfolios.filter((p) => p.isPublished).length;
  const totalViews = portfolios.reduce((acc, p) => acc + (p.viewsCount || 0), 0);

  const stats = [
    {
      label: 'Total Portfolios',
      value: totalPortfolios,
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      sub: totalPortfolios === 1 ? '1 active workspace' : `${totalPortfolios} workspaces`,
    },
    {
      label: 'Published Live',
      value: publishedCount,
      icon: <Globe className="w-4 h-4 text-sky-400" />,
      sub: `${publishedCount} publicly shareable`,
    },
    {
      label: 'Page Count',
      value: totalViews,
      icon: <Eye className="w-4 h-4 text-purple-400" />,
      sub: 'Cumulative portfolio views',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between shadow-subtle"
        >
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-display text-white">
                {stat.value}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{stat.sub}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
