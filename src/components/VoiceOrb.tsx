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
      scale: 1.05,
    },
    speaking: {
      label: 'Speaking...',
      scale: 1.02,
    },
    processing: {
      label: 'Thinking...',
      scale: 1,
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        {/* Subtle ring animation for listening/speaking */}
        {(isListening || isSpeaking) && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-foreground/20"
            animate={{
              scale: [1, 1.3],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}

        {/* Main orb */}
        <motion.button
          onClick={onClick}
          disabled={disabled || isSpeaking || isProcessing}
          className={cn(
            "relative w-28 h-28 rounded-full",
            "flex items-center justify-center cursor-pointer",
            "transition-colors duration-300",
            "bg-foreground text-background",
            "hover:bg-foreground/90",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          animate={{
            scale: config.scale,
          }}
          whileHover={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 1.03 } : {}}
          whileTap={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 0.97 } : {}}
        >
          {/* Icon */}
          <motion.div className="relative z-10">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 animate-spin" strokeWidth={1.5} />
            ) : (
              <Mic className="w-8 h-8" strokeWidth={1.5} />
            )}
          </motion.div>

          {/* Audio visualizer bars for speaking */}
          {isSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 bg-background/40 rounded-full"
                  animate={{
                    height: [6, 16, 10, 18, 6],
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
        className="text-sm text-muted-foreground font-medium tracking-wide"
        key={status}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {config.label}
      </motion.p>
    </div>
  );
};

export default VoiceOrb;
