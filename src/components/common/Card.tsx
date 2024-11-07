import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card = ({ children, className = '', title, action }: CardProps) => (
  <div className={`
    tech-card
    p-6 
    ${className}
  `}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-6">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}
        {action}
      </div>
    )}
    {children}
  </div>
);