import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  children?: React.ReactNode;
}

const variants = {
  primary: 'tech-button',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-dark-700/50 dark:hover:bg-dark-600 dark:text-gray-200 hover:shadow-neon transition-all duration-300',
  danger: 'bg-red-600 hover:bg-red-700 text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all duration-300',
  ghost: 'hover:bg-gray-100 text-gray-600 dark:hover:bg-dark-700 dark:text-gray-300 transition-all duration-300',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg',
};

export const Button = ({ 
  variant = 'primary',
  size = 'md',
  icon: Icon,
  children,
  className = '',
  ...props
}: ButtonProps) => (
  <button
    className={`
      inline-flex items-center justify-center rounded-lg font-medium
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}
    {...props}
  >
    {Icon && <Icon className={`w-5 h-5 ${children ? 'mr-2' : ''}`} />}
    {children}
  </button>
);