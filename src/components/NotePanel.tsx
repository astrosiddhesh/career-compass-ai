import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StudentNote, ConversationPhase } from '@/types/conversation';
import { 
  Hand, ClipboardList, Lightbulb, Zap, Settings, Compass, BarChart3, CheckCircle,
  User, Star, Gem, Target, Rocket, FileText, Sparkles
} from 'lucide-react';

interface NotePanelProps {
  notes: StudentNote[];
  currentPhase: ConversationPhase;
}

const phaseConfig: Record<ConversationPhase, { label: string; Icon: React.ElementType }> = {
  welcome: { label: 'Getting Started', Icon: Hand },
  basic_info: { label: 'Basic Information', Icon: ClipboardList },
  interests: { label: 'Interests & Passions', Icon: Lightbulb },
  strengths: { label: 'Strengths & Traits', Icon: Zap },
  preferences: { label: 'Work Preferences', Icon: Settings },
  career_exploration: { label: 'Career Exploration', Icon: Compass },
  summary: { label: 'Creating Summary', Icon: BarChart3 },
  complete: { label: 'Discovery Complete', Icon: CheckCircle },
};

const categoryConfig: Record<string, { Icon: React.ElementType; gradient: string }> = {
  basic_info: { Icon: User, gradient: 'from-primary/20 to-primary/5' },
  interests: { Icon: Star, gradient: 'from-accent/20 to-accent/5' },
  strengths: { Icon: Gem, gradient: 'from-primary-light/20 to-primary-light/5' },
  preferences: { Icon: Target, gradient: 'from-secondary/30 to-secondary/10' },
  career_match: { Icon: Rocket, gradient: 'from-accent/20 to-primary/10' },
};

const NotePanel: React.FC<NotePanelProps> = ({ notes, currentPhase }) => {
  const { label: phaseLabel, Icon: PhaseIcon } = phaseConfig[currentPhase];

  return (
    <div className="h-full flex flex-col bg-card/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
            <PhaseIcon className="h-5 w-5 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Discovery Notes</h2>
            <p className="text-xs text-muted-foreground">{phaseLabel}</p>
          </div>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--gradient-primary)' }}
            initial={{ width: 0 }}
            animate={{
              width: `${(Object.keys(phaseConfig).indexOf(currentPhase) / (Object.keys(phaseConfig).length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center mb-5 border border-primary/20">
                <Sparkles className="w-6 h-6 text-primary" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Notes will appear here as we learn about you
              </p>
            </motion.div>
          ) : (
            notes.map((note, index) => {
              const config = categoryConfig[note.category] || { Icon: FileText, gradient: 'from-muted/50 to-muted/20' };
              const { Icon: CategoryIcon, gradient } = config;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={cn(
                    "rounded-xl p-4 border border-border/50 backdrop-blur-sm",
                    "bg-gradient-to-br transition-all duration-300",
                    "hover:border-primary/30 hover:shadow-glow",
                    gradient
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-card/80 flex items-center justify-center shrink-0 border border-border/50">
                      <CategoryIcon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground">{note.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{note.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center">
          <span className="gradient-text font-medium">{notes.length}</span> {notes.length === 1 ? 'insight' : 'insights'} captured
        </p>
      </div>
    </div>
  );
};

export default NotePanel;
