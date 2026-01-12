import React from 'react';
import { motion } from 'framer-motion';
import { Check, Hand, User, Lightbulb, Zap, Settings, Compass, FileText } from 'lucide-react';
import { ConversationPhase } from '@/types/conversation';

interface ProgressTrackerProps {
  currentPhase: ConversationPhase;
}

const phases: { key: ConversationPhase; label: string; Icon: React.ElementType }[] = [
  { key: 'welcome', label: 'Welcome', Icon: Hand },
  { key: 'basic_info', label: 'About You', Icon: User },
  { key: 'interests', label: 'Interests', Icon: Lightbulb },
  { key: 'strengths', label: 'Strengths', Icon: Zap },
  { key: 'preferences', label: 'Preferences', Icon: Settings },
  { key: 'career_exploration', label: 'Explore', Icon: Compass },
  { key: 'summary', label: 'Report', Icon: FileText },
];

const getPhaseIndex = (phase: ConversationPhase): number => {
  const idx = phases.findIndex(p => p.key === phase);
  return idx === -1 ? 0 : idx;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentPhase }) => {
  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <div className="w-full py-2">
      {/* Mobile: Simple dot progress */}
      <div className="flex md:hidden items-center justify-center gap-1.5">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={phase.key}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isCompleted || isCurrent ? 'bg-primary' : 'bg-gray-200'
              } ${isCurrent ? 'w-6' : ''}`}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            />
          );
        })}
      </div>

      {/* Desktop: Chip-style progress */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <motion.div
              key={phase.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className={`chip transition-all duration-200 ${
                isCompleted || isCurrent ? 'chip-active' : ''
              } ${isPending ? 'opacity-50' : ''}`}
            >
              {isCompleted ? (
                <Check className="w-3 h-3" strokeWidth={2.5} />
              ) : (
                <phase.Icon className="w-3 h-3" strokeWidth={1.5} />
              )}
              <span className="text-xs">{phase.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;