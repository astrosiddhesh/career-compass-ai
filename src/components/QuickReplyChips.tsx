import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lightbulb, Target, Heart } from 'lucide-react';

interface QuickReplyChipsProps {
  onSelect: (message: string) => void;
  disabled?: boolean;
}

const suggestions = [
  { icon: Sparkles, text: "Tell me about tech careers", color: "text-purple-500" },
  { icon: Lightbulb, text: "What are my strengths?", color: "text-amber-500" },
  { icon: Target, text: "Help me find my passion", color: "text-blue-500" },
  { icon: Heart, text: "Creative career options", color: "text-pink-500" },
];

const QuickReplyChips: React.FC<QuickReplyChipsProps> = ({ onSelect, disabled }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 justify-center"
    >
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon;
        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(suggestion.text)}
            disabled={disabled}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 
                       hover:border-primary/30 hover:bg-primary/5 transition-all duration-200
                       text-sm text-muted-foreground hover:text-foreground
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <Icon className={`w-4 h-4 ${suggestion.color}`} />
            <span>{suggestion.text}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default QuickReplyChips;
