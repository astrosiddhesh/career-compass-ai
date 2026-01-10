import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Mic, Loader2 } from 'lucide-react';

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
      label: 'Tap to speak',
      scale: 1,
    },
    listening: {
      label: 'Listening...',
      scale: 1.08,
    },
    speaking: {
      label: 'Speaking...',
      scale: 1.04,
    },
    processing: {
      label: 'Thinking...',
      scale: 1,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative">
        {/* Outer glow rings */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(270 75% 65% / 0.2) 0%, transparent 70%)',
            scale: 1.8,
          }}
          animate={{
            opacity: isListening || isSpeaking ? [0.3, 0.6, 0.3] : 0.2,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated ring for listening/speaking */}
        {(isListening || isSpeaking) && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/40"
              animate={{
                scale: [1, 1.5, 1.8],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-accent/30"
              animate={{
                scale: [1, 1.3, 1.6],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.5,
              }}
            />
          </>
        )}

        {/* Main orb */}
        <motion.button
          onClick={onClick}
          disabled={disabled || isSpeaking || isProcessing}
          className={cn(
            "relative w-32 h-32 rounded-full",
            "flex items-center justify-center cursor-pointer",
            "transition-all duration-500",
            "orb-glow",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          animate={{
            scale: config.scale,
          }}
          whileHover={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 1.05 } : {}}
          whileTap={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 0.95 } : {}}
        >
          {/* Inner highlight */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
          
          {/* Icon */}
          <motion.div className="relative z-10">
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-primary-foreground animate-spin" strokeWidth={1.5} />
            ) : (
              <Mic className="w-10 h-10 text-primary-foreground" strokeWidth={1.5} />
            )}
          </motion.div>

          {/* Audio visualizer bars for speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-primary-foreground/50 rounded-full"
                  animate={{
                    height: [8, 24, 12, 28, 8],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.08,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {/* Status label */}
      <motion.p
        className="text-sm text-muted-foreground font-medium tracking-wide"
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {config.label}
      </motion.p>
    </div>
  );
};

export default VoiceOrb;
