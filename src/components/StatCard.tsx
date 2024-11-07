import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
  changeColor?: string;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export const StatCard = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  changeColor = 'text-emerald-600',
  className = '',
  trend = 'neutral'
}: StatCardProps) => (
  <div className={`
    tech-card
    relative p-6
    ${className}
  `}>
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</h3>
        <div className="p-2 bg-primary-500/10 dark:bg-primary-500/20 rounded-lg">
          <Icon className="w-5 h-5 text-primary-500" />
        </div>
      </div>
      <div>
        <p className="text-gray-900 dark:text-white text-2xl font-bold">{value}</p>
        <p className={`text-sm mt-1 ${changeColor}`}>
          {change}
        </p>
      </div>
    </div>
  </div>
);