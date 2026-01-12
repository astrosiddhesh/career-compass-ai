import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConversationMessage } from '@/types/conversation';
import { Copy, ThumbsUp, Volume2, RefreshCw } from 'lucide-react';

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
    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto">
      <AnimatePresence mode="popLayout">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[85%] md:max-w-[75%] px-4 py-3",
                message.role === 'user' ? 'message-user' : 'message-assistant'
              )}
            >
              <p className="text-sm md:text-base leading-relaxed">
                {message.content}
              </p>
              
              {/* Action buttons for assistant messages */}
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div className="flex-1" />
                  <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Live transcript */}
        {isListening && currentTranscript && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="message-user max-w-[85%] md:max-w-[75%] px-4 py-3 opacity-70">
              <p className="text-sm md:text-base italic">
                {currentTranscript}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="ml-0.5"
                >
                  |
                </motion.span>
              </p>
            </div>
          </motion.div>
        )}

        {/* Processing indicator */}
        {messages.length > 0 && messages[messages.length - 1]?.role === 'user' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="message-assistant px-4 py-3">
              <p className="text-sm text-muted-foreground">Searching....</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {messages.length === 0 && !currentTranscript && (
        <div className="flex items-center justify-center h-full py-12">
          <div className="text-center">
            <p className="text-muted-foreground">
              Start your career discovery journey
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationDisplay;