import React from 'react';
import { motion } from 'framer-motion';

interface AbstractOrbProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  isProcessing?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AbstractOrb: React.FC<AbstractOrbProps> = ({ 
  isListening = false, 
  isSpeaking = false,
  isProcessing = false,
  size = 'md' 
}) => {
  const isActive = isListening || isSpeaking || isProcessing;
  
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const lineCount = 60;
  const lines = Array.from({ length: lineCount }, (_, i) => i);

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300/30 via-pink-200/20 to-blue-300/30 blur-2xl scale-125" />
      
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full relative z-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="50%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id="lineGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>

        {/* Radiating lines forming the circular pattern */}
        <g>
          {lines.map((i) => {
            const angle = (i / lineCount) * 360;
            const gradientId = i % 3 === 0 ? 'lineGrad1' : i % 3 === 1 ? 'lineGrad2' : 'lineGrad3';
            const innerRadius = 25 + Math.sin(i * 0.3) * 5;
            const outerRadius = 70 + Math.sin(i * 0.5) * 15;
            
            const x1 = 100 + Math.cos((angle * Math.PI) / 180) * innerRadius;
            const y1 = 100 + Math.sin((angle * Math.PI) / 180) * innerRadius;
            const x2 = 100 + Math.cos((angle * Math.PI) / 180) * outerRadius;
            const y2 = 100 + Math.sin((angle * Math.PI) / 180) * outerRadius;

            return (
              <motion.line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`url(#${gradientId})`}
                strokeWidth={1.5}
                strokeLinecap="round"
                opacity={0.7 + Math.sin(i * 0.2) * 0.3}
                animate={isActive ? {
                  x2: [x2, x2 + Math.cos((angle * Math.PI) / 180) * 10, x2],
                  y2: [y2, y2 + Math.sin((angle * Math.PI) / 180) * 10, y2],
                  opacity: [0.7, 1, 0.7],
                } : {}}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.02,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </g>

        {/* Center circle */}
        <circle
          cx="100"
          cy="100"
          r="20"
          fill="white"
          opacity="0.9"
        />
        <circle
          cx="100"
          cy="100"
          r="15"
          fill="url(#lineGrad1)"
          opacity="0.3"
        />
      </svg>
    </div>
  );
};

export default AbstractOrb;