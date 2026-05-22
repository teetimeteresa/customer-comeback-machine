import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-[1.25rem] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20',
    default: 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20',
    secondary: 'bg-slate-900 text-white hover:bg-slate-950 shadow-lg shadow-slate-900/10',
    outline: 'border-2 border-slate-100 bg-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-200 hover:text-slate-900',
  };
  
  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-8 py-3.5 text-xs',
    lg: 'px-10 py-4.5 text-sm',
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
