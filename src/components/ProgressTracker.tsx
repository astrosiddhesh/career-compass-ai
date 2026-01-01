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
    <div className="w-full px-6 py-4">
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const { Icon } = phase;

          return (
            <React.Fragment key={phase.key}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2"
              >
                <motion.div
                  className={`
                    relative flex h-10 w-10 items-center justify-center rounded-full
                    transition-all duration-300
                    ${isCompleted ? 'bg-foreground text-background' : ''}
                    ${isCurrent ? 'bg-foreground text-background' : ''}
                    ${isPending ? 'bg-muted text-muted-foreground' : ''}
                  `}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </motion.div>
                <span className={`text-xs font-medium tracking-wide ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {phase.label}
                </span>
              </motion.div>

              {index < phases.length - 1 && (
                <div className="flex-1 h-px mx-4 bg-border">
                  <motion.div
                    className="h-full bg-foreground"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.4 }}
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
