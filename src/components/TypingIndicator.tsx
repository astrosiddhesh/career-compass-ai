import React from 'react';
import { motion } from 'framer-motion';
import BotAvatar from './BotAvatar';

interface TypingIndicatorProps {
  botVariant?: 'neo' | 'neha';
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ botVariant = 'neo' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-start gap-3"
    >
      {/* Pulsing bot avatar */}
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="flex-shrink-0"
      >
        <BotAvatar variant={botVariant} size="sm" isActive showGlow />
      </motion.div>
      
      {/* Typing dots */}
      <div className="message-assistant px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-primary/60"
            animate={{
              y: [0, -6, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">Thinking...</span>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;
