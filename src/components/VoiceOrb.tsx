import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  onClick,
  disabled = false,
}) => {
  const getStatus = () => {
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    if (isSpeaking) return 'speaking';
    return 'idle';
  };

  const status = getStatus();

  const statusConfig = {
    idle: {
      gradient: 'from-primary to-primary-dark',
      label: 'Tap to speak',
      scale: 1,
    },
    listening: {
      gradient: 'from-accent to-accent-light',
      label: 'Listening...',
      scale: 1.1,
    },
    speaking: {
      gradient: 'from-secondary to-primary',
      label: 'Speaking...',
      scale: 1.05,
    },
    processing: {
      gradient: 'from-muted-foreground to-muted',
      label: 'Thinking...',
      scale: 1,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Ripple effects */}
        {(isListening || isSpeaking) && (
          <>
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-br",
                config.gradient
              )}
              animate={{
                scale: [1, 1.8],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className={cn(
                "absolute inset-0 rounded-full bg-gradient-to-br",
                config.gradient
              )}
              animate={{
                scale: [1, 1.5],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
          </>
        )}

        {/* Main orb */}
        <motion.button
          onClick={onClick}
          disabled={disabled || isSpeaking || isProcessing}
          className={cn(
            "relative w-32 h-32 rounded-full bg-gradient-to-br shadow-lg",
            "flex items-center justify-center cursor-pointer",
            "transition-all duration-300",
            config.gradient,
            disabled && "opacity-50 cursor-not-allowed"
          )}
          animate={{
            scale: config.scale,
          }}
          whileHover={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 1.05 } : {}}
          whileTap={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 0.95 } : {}}
          style={{
            boxShadow: isListening
              ? '0 0 40px hsl(12 85% 62% / 0.4), 0 0 80px hsl(12 85% 62% / 0.2)'
              : isSpeaking
              ? '0 0 40px hsl(252 60% 60% / 0.4), 0 0 80px hsl(252 60% 60% / 0.2)'
              : '0 0 30px hsl(174 62% 45% / 0.3), 0 0 60px hsl(174 62% 45% / 0.15)',
          }}
        >
          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm" />
          
          {/* Icon */}
          <motion.div
            className="relative z-10"
            animate={isProcessing ? { rotate: 360 } : {}}
            transition={isProcessing ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
          >
            {isProcessing ? (
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </motion.div>

          {/* Audio visualizer bars for speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white/50 rounded-full"
                  animate={{
                    height: [8, 24, 16, 28, 8],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {/* Status label */}
      <motion.p
        className="text-muted-foreground font-medium"
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {config.label}
      </motion.p>
    </div>
  );
};

export default VoiceOrb;
