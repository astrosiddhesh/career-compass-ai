import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { ConversationPhase } from '@/types/conversation';

interface ProgressTrackerProps {
  currentPhase: ConversationPhase;
}

const phases: { key: ConversationPhase; label: string; icon: string }[] = [
  { key: 'welcome', label: 'Welcome', icon: '👋' },
  { key: 'basic_info', label: 'About You', icon: '📝' },
  { key: 'interests', label: 'Interests', icon: '💡' },
  { key: 'strengths', label: 'Strengths', icon: '💪' },
  { key: 'preferences', label: 'Preferences', icon: '⚙️' },
  { key: 'career_exploration', label: 'Explore', icon: '🔍' },
  { key: 'summary', label: 'Report', icon: '📊' },
];

const getPhaseIndex = (phase: ConversationPhase): number => {
  const idx = phases.findIndex(p => p.key === phase);
  return idx === -1 ? 0 : idx;
};

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentPhase }) => {
  const currentIndex = getPhaseIndex(currentPhase);

  return (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-between gap-1">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <React.Fragment key={phase.key}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-1"
              >
                <motion.div
                  className={`
                    relative flex h-8 w-8 items-center justify-center rounded-full text-sm
                    transition-all duration-300
                    ${isCompleted ? 'bg-primary text-primary-foreground' : ''}
                    ${isCurrent ? 'bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background' : ''}
                    ${isPending ? 'bg-muted text-muted-foreground' : ''}
                  `}
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{phase.icon}</span>
                  )}
                </motion.div>
                <span className={`text-[10px] font-medium ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {phase.label}
                </span>
              </motion.div>

              {index < phases.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 rounded-full overflow-hidden bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : isCurrent ? '50%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
