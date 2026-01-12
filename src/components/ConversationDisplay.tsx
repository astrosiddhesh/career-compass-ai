import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConversationMessage } from '@/types/conversation';
import { Sparkles } from 'lucide-react';

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

  // Show only the last message prominently
  const lastMessage = messages[messages.length - 1];

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto"
    >
      <AnimatePresence mode="popLayout">
        {messages.length > 0 && lastMessage && (
          <motion.div
            key={lastMessage.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            {lastMessage.role === 'assistant' && (
              <p className="text-xs text-muted-foreground mb-3">Go ahead, I'm Listening...</p>
            )}
            <p className="text-lg md:text-xl leading-relaxed text-foreground">
              {lastMessage.role === 'user' ? (
                <>
                  <span className="font-medium">{lastMessage.content}</span>
                </>
              ) : (
                <>
                  {lastMessage.content.split(/(\?)/).map((part, i) => (
                    <span key={i}>
                      {part}
                      {part === '?' && <span className="text-primary"> </span>}
                    </span>
                  ))}
                </>
              )}
            </p>
            {lastMessage.role === 'user' && (
              <p className="text-primary text-sm mt-3">
                {lastMessage.content.includes('?') ? '' : 'Can you guide me through this one step at a time?'}
              </p>
            )}
          </motion.div>
        )}

        {/* Live transcript while listening */}
        {isListening && currentTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-lg text-muted-foreground italic">
              {currentTranscript}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="ml-0.5 text-primary"
              >
                |
              </motion.span>
            </p>
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
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border border-primary/10">
              <Sparkles className="w-5 h-5 text-primary/60" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Ready to discover your perfect career path
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ConversationDisplay;