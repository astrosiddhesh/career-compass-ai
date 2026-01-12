import React from 'react';
import { motion } from 'framer-motion';

interface BotAvatarProps {
  variant: 'neo' | 'neha';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  showGlow?: boolean;
}

const BotAvatar: React.FC<BotAvatarProps> = ({ 
  variant, 
  size = 'md', 
  isActive = false,
  showGlow = false 
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const isNeo = variant === 'neo';
  
  // Color schemes
  const primaryColor = isNeo ? '#7C3AED' : '#EC4899';
  const secondaryColor = isNeo ? '#A78BFA' : '#F472B6';
  const accentColor = isNeo ? '#60A5FA' : '#FB7185';
  const glowColor = isNeo ? 'rgba(124, 58, 237, 0.4)' : 'rgba(236, 72, 153, 0.4)';

  return (
    <motion.div 
      className={`${sizeClasses[size]} relative`}
      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Glow effect */}
      {showGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-2xl opacity-60"
          style={{ background: `radial-gradient(circle, ${glowColor}, transparent 70%)` }}
        />
      )}
      
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body/Base */}
        <defs>
          <linearGradient id={`bodyGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F3F4F6" />
          </linearGradient>
          <linearGradient id={`accentGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primaryColor} />
            <stop offset="100%" stopColor={secondaryColor} />
          </linearGradient>
          <filter id={`glow-${variant}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Robot Head - Rounded Rectangle */}
        <rect 
          x="20" 
          y="15" 
          width="60" 
          height="50" 
          rx="18" 
          fill={`url(#bodyGrad-${variant})`}
          stroke="#E5E7EB"
          strokeWidth="1.5"
        />

        {/* Screen/Face area */}
        <rect 
          x="28" 
          y="25" 
          width="44" 
          height="30" 
          rx="10" 
          fill="#1F2937"
        />

        {/* Eyes */}
        <motion.ellipse 
          cx="40" 
          cy="38" 
          rx={isNeo ? "5" : "4"} 
          ry={isNeo ? "6" : "5"} 
          fill={primaryColor}
          filter={`url(#glow-${variant})`}
          animate={isActive ? { 
            scaleY: [1, 0.2, 1],
          } : {}}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />
        <motion.ellipse 
          cx="60" 
          cy="38" 
          rx={isNeo ? "5" : "4"} 
          ry={isNeo ? "6" : "5"} 
          fill={primaryColor}
          filter={`url(#glow-${variant})`}
          animate={isActive ? { 
            scaleY: [1, 0.2, 1],
          } : {}}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
        />

        {/* Eye highlights */}
        <circle cx="42" cy="36" r="2" fill="white" opacity="0.8" />
        <circle cx="62" cy="36" r="2" fill="white" opacity="0.8" />

        {/* Mouth/Smile */}
        {isNeo ? (
          // Neo - friendly square smile
          <rect x="43" y="46" width="14" height="4" rx="2" fill={secondaryColor} />
        ) : (
          // Neha - cute curved smile
          <path 
            d="M42 47 Q50 53 58 47" 
            stroke={secondaryColor} 
            strokeWidth="3" 
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Antenna */}
        <circle 
          cx="50" 
          cy="10" 
          r="5" 
          fill={`url(#accentGrad-${variant})`}
        />
        <rect x="48" y="10" width="4" height="8" fill="#E5E7EB" />

        {/* Ears/Side panels */}
        <rect 
          x="12" 
          y="32" 
          width="8" 
          height="16" 
          rx="3" 
          fill={`url(#accentGrad-${variant})`}
        />
        <rect 
          x="80" 
          y="32" 
          width="8" 
          height="16" 
          rx="3" 
          fill={`url(#accentGrad-${variant})`}
        />

        {/* Body */}
        <path 
          d="M30 65 L30 80 Q30 88 38 88 L62 88 Q70 88 70 80 L70 65 Q70 68 50 70 Q30 68 30 65"
          fill={`url(#bodyGrad-${variant})`}
          stroke="#E5E7EB"
          strokeWidth="1.5"
        />

        {/* Chest accent */}
        <circle 
          cx="50" 
          cy="76" 
          r="6" 
          fill={`url(#accentGrad-${variant})`}
          opacity="0.9"
        />
        
        {/* Neha gets a small bow */}
        {!isNeo && (
          <>
            <circle cx="75" cy="20" r="4" fill={accentColor} />
            <circle cx="82" cy="23" r="3" fill={accentColor} />
            <circle cx="78" cy="27" r="2" fill={accentColor} />
          </>
        )}

        {/* Arm hints */}
        <ellipse 
          cx="25" 
          cy="75" 
          rx="6" 
          ry="8" 
          fill={`url(#bodyGrad-${variant})`}
          stroke="#E5E7EB"
          strokeWidth="1"
        />
        <ellipse 
          cx="75" 
          cy="75" 
          rx="6" 
          ry="8" 
          fill={`url(#bodyGrad-${variant})`}
          stroke="#E5E7EB"
          strokeWidth="1"
        />

        {/* Waving hand for active state */}
        {isActive && (
          <motion.g
            animate={{ rotate: [-10, 20, -10] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{ transformOrigin: '80px 70px' }}
          >
            <ellipse 
              cx="85" 
              cy="65" 
              rx="5" 
              ry="6" 
              fill={`url(#bodyGrad-${variant})`}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
};

export default BotAvatar;