import React from 'react';

interface BlueprintPatternProps {
  variant?: 'hero' | 'timber' | 'monolith' | 'fachwerk' | 'spa' | 'restaurant';
  className?: string;
}

export const BlueprintPattern: React.FC<BlueprintPatternProps> = ({
  variant = 'hero',
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 400 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <defs>
        <pattern id={`grid-${variant}`} width="24" height="24" patternUnits="userSpaceOnUse">
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke="rgba(200,169,126,0.09)"
            strokeWidth="0.6"
          />
        </pattern>
        <linearGradient id={`fade-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C8A97E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C8A97E" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      <rect width="400" height="180" fill={`url(#grid-${variant})`} />

      {variant === 'hero' && (
        <g stroke={`url(#fade-${variant})`} strokeWidth="1">
          <path d="M24 140 H376 M24 40 H260 M260 40 L320 96 H376" />
          <rect x="64" y="64" width="120" height="56" rx="2" strokeDasharray="4 4" />
          <circle cx="290" cy="96" r="28" />
          <circle cx="290" cy="96" r="6" fill="#C8A97E" fillOpacity="0.35" />
          <path d="M184 92 H262" strokeDasharray="2 3" />
        </g>
      )}

      {variant === 'timber' && (
        <g stroke="rgba(200,169,126,0.28)" strokeWidth="1">
          <path d="M40 120 L140 52 L240 120 H40 Z" />
          <path d="M70 120 V152 H210 V120" />
          <path d="M260 65 H360 M260 85 H340 M260 105 H355" strokeDasharray="3 3" />
          <circle cx="140" cy="92" r="10" />
        </g>
      )}

      {variant === 'fachwerk' && (
        <g stroke="rgba(200,169,126,0.28)" strokeWidth="1">
          <rect x="48" y="44" width="176" height="96" />
          <path d="M48 44 L224 140 M224 44 L48 140 M136 44 V140 M48 92 H224" />
          <path d="M256 64 H352 V124 H256 Z" strokeDasharray="4 3" />
        </g>
      )}

      {variant === 'monolith' && (
        <g stroke="rgba(200,169,126,0.28)" strokeWidth="1">
          <rect x="36" y="54" width="140" height="84" />
          <rect x="176" y="76" width="110" height="62" />
          <path d="M36 96 H286 M106 54 V138 M310 54 V138 M304 54 H316 M304 138 H316" />
        </g>
      )}

      {variant === 'spa' && (
        <g stroke="rgba(200,169,126,0.28)" strokeWidth="1">
          <rect x="44" y="48" width="210" height="88" rx="14" />
          <path d="M74 92 Q104 72 134 92 T194 92 T224 92" />
          <circle cx="314" cy="92" r="32" strokeDasharray="4 4" />
          <circle cx="314" cy="92" r="14" />
        </g>
      )}

      {variant === 'restaurant' && (
        <g stroke="rgba(200,169,126,0.28)" strokeWidth="1">
          <rect x="40" y="42" width="320" height="98" rx="4" />
          <circle cx="110" cy="91" r="18" />
          <circle cx="200" cy="91" r="18" />
          <circle cx="290" cy="91" r="18" />
          <path d="M40 60 H360" strokeDasharray="3 3" />
        </g>
      )}
    </svg>
  );
};
