import React from 'react';

interface PrashaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
}

export const PrashaLogo: React.FC<PrashaLogoProps> = ({
  size = 'md',
  className = '',
  theme = 'light',
}) => {
  const sizeClasses = {
    sm: 'text-sm sm:text-base tracking-[0.14em]',
    md: 'text-base sm:text-lg tracking-[0.16em]',
    lg: 'text-lg sm:text-xl tracking-[0.18em]',
    xl: 'text-xl sm:text-2xl tracking-[0.2em]',
  };

  const textColor = theme === 'dark' ? 'text-[#FFFFFF]' : 'text-[#171817]';

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <span className="w-2 h-2 rounded-full bg-[#B58A18] shrink-0" />
      <span className={`font-heading font-extrabold uppercase ${textColor} ${sizeClasses[size]} leading-none`}>
        PRASHA INFOTECH
      </span>
    </div>
  );
};
