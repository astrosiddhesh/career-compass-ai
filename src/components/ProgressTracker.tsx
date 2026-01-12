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
    <div className="w-full py-4">
      {/* Compact chip-style progress for the Botzy look */}
      <div className="flex items-center gap-2 flex-wrap">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <motion.div
              key={phase.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`
                chip transition-all duration-300
                ${isCompleted ? 'chip-active' : ''}
                ${isCurrent ? 'chip-active border-primary/40' : ''}
                ${isPending ? 'opacity-60' : ''}
              `}
            >
              {isCompleted ? (
                <Check className="w-3 h-3" strokeWidth={2.5} />
              ) : (
                <phase.Icon className="w-3 h-3" strokeWidth={1.5} />
              )}
              <span>{phase.label}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;