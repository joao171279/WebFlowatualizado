import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input = ({ label, icon: Icon, error, className = '', ...props }: InputProps) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <input
        className={`
          block w-full rounded-lg
          border border-gray-300 dark:border-slate-600
          bg-white dark:bg-slate-700
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:ring-2 focus:ring-primary-500 focus:border-transparent
          ${Icon ? 'pl-10' : 'pl-4'}
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
    </div>
    {error && (
      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);