import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConversationMessage } from '@/types/conversation';
import { MessageCircle, Sparkles } from 'lucide-react';

interface ConversationDisplayProps {
  messages: ConversationMessage[];
  currentTranscript?: string;
  isListening: boolean;
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  currentTranscript,
  isListening,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentTranscript]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl px-4 py-3",
                message.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-primary-dark text-primary-foreground'
                  : 'bg-card/80 border border-border/50 text-foreground backdrop-blur-sm'
              )}
            >
              <p className="text-sm leading-relaxed">
                {message.content}
              </p>
              <p
                className={cn(
                  "text-xs mt-2",
                  message.role === 'user' ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground'
                )}
              >
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Live transcript while listening */}
        {isListening && currentTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-muted/50 border border-primary/20 backdrop-blur-sm">
              <p className="text-sm text-muted-foreground italic">
                {currentTranscript}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="ml-0.5 text-primary"
                >
                  |
                </motion.span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {messages.length === 0 && !currentTranscript && (
        <div className="flex items-center justify-center h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center border border-primary/20">
              <Sparkles className="w-7 h-7 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-medium text-foreground mb-2">
              Ready to begin
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Click the microphone or type to start your career discovery journey
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConversationDisplay;
