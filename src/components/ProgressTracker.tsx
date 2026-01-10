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
    <div className="w-full px-6 py-5">
      <div className="flex items-center justify-between">
        {phases.map((phase, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;
          const { Icon } = phase;

          return (
            <React.Fragment key={phase.key}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-2.5"
              >
                <motion.div
                  className={`
                    relative flex h-11 w-11 items-center justify-center rounded-xl
                    transition-all duration-400
                    ${isCompleted ? 'bg-gradient-to-br from-primary to-accent shadow-glow' : ''}
                    ${isCurrent ? 'bg-gradient-to-br from-primary to-accent shadow-glow' : ''}
                    ${isPending ? 'bg-muted/50 border border-border/50' : ''}
                  `}
                  animate={isCurrent ? {
                    boxShadow: [
                      '0 0 20px hsl(270 75% 65% / 0.3)',
                      '0 0 30px hsl(270 75% 65% / 0.5)',
                      '0 0 20px hsl(270 75% 65% / 0.3)',
                    ],
                  } : {}}
                  transition={isCurrent ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  } : {}}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                  ) : (
                    <Icon className={`h-5 w-5 ${isPending ? 'text-muted-foreground' : 'text-primary-foreground'}`} strokeWidth={1.5} />
                  )}
                </motion.div>
                <span className={`text-xs font-medium tracking-wide ${isCurrent ? 'gradient-text' : 'text-muted-foreground'}`}>
                  {phase.label}
                </span>
              </motion.div>

              {index < phases.length - 1 && (
                <div className="flex-1 h-0.5 mx-3 bg-muted/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--gradient-primary)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
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
