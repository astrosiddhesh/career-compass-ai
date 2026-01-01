import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConversationMessage } from '@/types/conversation';

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
      className="flex-1 overflow-y-auto p-6 space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-5 py-3 shadow-sm",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border rounded-bl-md'
              )}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p
                className={cn(
                  "text-xs mt-1 opacity-60",
                  message.role === 'user' ? 'text-right' : 'text-left'
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-primary/20 border border-primary/30 rounded-br-md">
              <p className="text-sm text-primary italic">
                {currentTranscript}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
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
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to Discover Your Career Path
              </h3>
              <p className="text-muted-foreground text-sm max-w-xs">
                Click "Start Conversation" to begin your personalized career discovery journey
              </p>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDisplay;
