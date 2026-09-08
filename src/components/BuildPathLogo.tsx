import React from 'react';

interface BuildPathLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withGlow?: boolean;
}

export const BuildPathLogo: React.FC<BuildPathLogoProps> = ({
  className = '',
  size = 'md',
  withGlow = true,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12',
  }[size];

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-lg bg-[#0e0e11] border border-[#dc0028]/40 ${
        withGlow ? 'shadow-[0_0_15px_rgba(220,0,40,0.35)]' : ''
      } ${sizeClasses} ${className}`}
    >
      {/* Geometric SVG Brand Mark */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        <defs>
          <linearGradient id="bpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4455" />
            <stop offset="100%" stopColor="#dc0028" />
          </linearGradient>
          <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc0028" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Outer subtle geometric bounding bracket / node polygon */}
        <polygon
          points="16,3 28,9.5 28,22.5 16,29 4,22.5 4,9.5"
          stroke="rgba(220, 0, 40, 0.3)"
          strokeWidth="1"
          fill="rgba(220, 0, 40, 0.05)"
        />

        {/* Dynamic Chevron Pipeline Path (Left to Right / Bottom to Top progression) */}
        <path
          d="M8 21 L14 15 L8 9"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Geometric 'B' + 'P' Intersecting Path Core */}
        <path
          d="M14 8 L22 8 C24.2 8 25.5 9.3 25.5 11.5 C25.5 13.7 24.2 15 22 15 L14 15 Z"
          fill="url(#bpGrad)"
        />
        <path
          d="M14 15 L14 24"
          stroke="url(#bpGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Forward Innovation Node */}
        <circle cx="21" cy="20" r="2" fill="#ffffff" />
        <line
          x1="14"
          y1="17"
          x2="20"
          y2="20"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.2"
          strokeDasharray="2 2"
        />
      </svg>
    </div>
  );
};
