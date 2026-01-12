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
      scale: 1.06,
    },
    speaking: {
      label: 'Speaking...',
      scale: 1.03,
    },
    processing: {
      label: 'Thinking...',
      scale: 1,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative orb-container">
        {/* Outer decorative rings */}
        <motion.div
          className="absolute rounded-full orb-ring"
          style={{
            inset: '-20px',
          }}
          animate={{
            opacity: isListening || isSpeaking ? [0.3, 0.5, 0.3] : 0.3,
            scale: isListening || isSpeaking ? [1, 1.02, 1] : 1,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute rounded-full orb-ring"
          style={{
            inset: '-40px',
          }}
          animate={{
            opacity: isListening || isSpeaking ? [0.2, 0.35, 0.2] : 0.2,
            scale: isListening || isSpeaking ? [1, 1.03, 1] : 1,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute rounded-full orb-ring"
          style={{
            inset: '-60px',
          }}
          animate={{
            opacity: isListening || isSpeaking ? [0.1, 0.25, 0.1] : 0.1,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Animated expanding rings for active states */}
        {(isListening || isSpeaking) && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/30"
              animate={{
                scale: [1, 1.6, 2],
                opacity: [0.5, 0.2, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border border-accent/25"
              animate={{
                scale: [1, 1.4, 1.8],
                opacity: [0.4, 0.15, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.8,
              }}
            />
          </>
        )}

        {/* Main orb */}
        <motion.button
          onClick={onClick}
          disabled={disabled || isSpeaking || isProcessing}
          className={cn(
            "relative w-36 h-36 rounded-full",
            "flex items-center justify-center cursor-pointer",
            "transition-all duration-500",
            "orb-glow",
            isListening && "animate-pulse-glow",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          animate={{
            scale: config.scale,
          }}
          whileHover={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 1.04 } : {}}
          whileTap={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 0.96 } : {}}
        >
          {/* Inner glass highlight */}
          <div className="orb-inner" />
          
          {/* Secondary highlight */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
          
          {/* Icon */}
          <motion.div className="relative z-10">
            {isProcessing ? (
              <Loader2 className="w-10 h-10 text-white/90 animate-spin" strokeWidth={1.5} />
            ) : (
              <Mic className="w-10 h-10 text-white/90" strokeWidth={1.5} />
            )}
          </motion.div>

          {/* Audio visualizer bars for speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white/60 rounded-full"
                  animate={{
                    height: [6, 20, 10, 24, 6],
                  }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: i * 0.07,
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
        className="text-sm text-muted-foreground font-medium"
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