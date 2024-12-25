import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../lib/theme/colors';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const SIZES = {
  sm: {
    container: 'w-8 h-8',
    icon: 'w-3 h-3',
    text: 'text-lg',
  },
  md: {
    container: 'w-10 h-10',
    icon: 'w-4 h-4',
    text: 'text-xl',
  },
  lg: {
    container: 'w-12 h-12',
    icon: 'w-5 h-5',
    text: 'text-2xl',
  },
};

export function Logo({ size = 'md' }: LogoProps) {
  const sizeClasses = SIZES[size];

  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className={`${sizeClasses.container} bg-[${BRAND.green}] rounded-full flex items-center justify-center`}>
        <div className={`${sizeClasses.icon} border-4 border-white rounded-sm transform rotate-45`} />
      </div>
      <div>
        <span className={`${sizeClasses.text} font-bold`}>
          <span style={{ color: BRAND.green }}>Tribute</span>
          <span style={{ color: BRAND.blue }}>Montage</span>
        </span>
      </div>
    </Link>
  );
}