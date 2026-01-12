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
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer rings */}
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/20"
          style={{ inset: '-16px' }}
          animate={{
            scale: isListening || isSpeaking ? [1, 1.1, 1] : 1,
            opacity: isListening || isSpeaking ? [0.3, 0.1, 0.3] : 0.2,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border border-primary/15"
          style={{ inset: '-32px' }}
          animate={{
            scale: isListening || isSpeaking ? [1, 1.05, 1] : 1,
            opacity: isListening || isSpeaking ? [0.2, 0.05, 0.2] : 0.1,
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        />

        {/* Main orb button */}
        <motion.button
          onClick={onClick}
          disabled={disabled || isSpeaking || isProcessing}
          className={cn(
            "relative w-20 h-20 md:w-24 md:h-24 rounded-full",
            "flex items-center justify-center cursor-pointer",
            "transition-all duration-300",
            "orb-glow",
            isListening && "animate-pulse-glow",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          animate={{ scale: config.scale }}
          whileHover={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 1.05 } : {}}
          whileTap={!disabled && !isSpeaking && !isProcessing ? { scale: config.scale * 0.95 } : {}}
        >
          {/* Inner highlight */}
          <div className="orb-inner" />
          
          {/* Icon */}
          <motion.div className="relative z-10">
            {isProcessing ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" strokeWidth={1.5} />
            ) : (
              <Mic className="w-8 h-8 text-white" strokeWidth={1.5} />
            )}
          </motion.div>

          {/* Speaking visualizer */}
          {isSpeaking && (
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white/60 rounded-full"
                  animate={{ height: [4, 16, 8, 20, 4] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.08,
                  }}
                />
              ))}
            </div>
          )}
        </motion.button>
      </div>

      {/* Status label */}
      <motion.p
        className="text-xs text-muted-foreground font-medium"
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {config.label}
      </motion.p>
    </div>
  );
};

export default VoiceOrb;