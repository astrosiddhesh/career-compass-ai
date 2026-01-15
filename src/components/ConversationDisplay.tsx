import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ConversationMessage } from '@/types/conversation';
import { Copy, ThumbsUp, Volume2, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';
import TypingIndicator from './TypingIndicator';

interface ConversationDisplayProps {
  messages: ConversationMessage[];
  currentTranscript?: string;
  isListening: boolean;
  isProcessing?: boolean;
  botVariant?: 'neo' | 'neha';
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  currentTranscript,
  isListening,
  isProcessing = false,
  botVariant = 'neo',
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);
  const [likedIds, setLikedIds] = React.useState<Set<string>>(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentTranscript]);

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id: string) => {
    setLikedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        toast.info('Feedback removed');
      } else {
        newSet.add(id);
        toast.success('Thanks for your feedback!');
      }
      return newSet;
    });
  };

  const handleSpeak = (content: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(content);
      speechSynthesis.speak(utterance);
      toast.success('Playing audio...');
    } else {
      toast.error('Speech not supported');
    }
  };

  const handleRefresh = () => {
    toast.info('Regenerate coming soon!');
  };

  return (
    <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto">
      <AnimatePresence mode="popLayout">
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
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
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100"
                >
                  <button 
                    onClick={() => handleCopy(message.content, message.id)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                  <button 
                    onClick={() => handleLike(message.id)}
                    className={cn(
                      "p-1.5 hover:bg-gray-100 rounded-lg transition-colors",
                      likedIds.has(message.id) && "bg-primary/10"
                    )}
                    title="Like"
                  >
                    <ThumbsUp className={cn(
                      "w-3.5 h-3.5",
                      likedIds.has(message.id) ? "text-primary fill-primary" : "text-muted-foreground"
                    )} />
                  </button>
                  <button 
                    onClick={() => handleSpeak(message.content)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Read aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <div className="flex-1" />
                  <button 
                    onClick={handleRefresh}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </motion.div>
              )}
            </motion.div>
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

        {/* Typing indicator */}
        {isProcessing && (
          <TypingIndicator botVariant={botVariant} />
        )}
      </AnimatePresence>

      {/* Empty state */}
      {messages.length === 0 && !currentTranscript && !isProcessing && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center h-full py-12"
        >
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <p className="text-muted-foreground">
                Start your career discovery journey
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ConversationDisplay;
