import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StudentNote, ConversationPhase } from '@/types/conversation';
import { 
  Hand, ClipboardList, Lightbulb, Zap, Settings, Compass, BarChart3, CheckCircle,
  User, Star, Gem, Target, Rocket, FileText
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

const categoryConfig: Record<string, { Icon: React.ElementType; className: string }> = {
  basic_info: { Icon: User, className: 'bg-muted text-foreground border-border' },
  interests: { Icon: Star, className: 'bg-muted text-foreground border-border' },
  strengths: { Icon: Gem, className: 'bg-muted text-foreground border-border' },
  preferences: { Icon: Target, className: 'bg-muted text-foreground border-border' },
  career_match: { Icon: Rocket, className: 'bg-muted text-foreground border-border' },
};

const NotePanel: React.FC<NotePanelProps> = ({ notes, currentPhase }) => {
  const { label: phaseLabel, Icon: PhaseIcon } = phaseConfig[currentPhase];

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <PhaseIcon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Discovery Notes</h2>
            <p className="text-xs text-muted-foreground">{phaseLabel}</p>
          </div>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-foreground rounded-full"
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
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-muted-foreground max-w-[200px]">
                Notes will appear here as we learn about you
              </p>
            </motion.div>
          ) : (
            notes.map((note, index) => {
              const config = categoryConfig[note.category] || { Icon: FileText, className: 'bg-muted text-foreground border-border' };
              const { Icon: CategoryIcon } = config;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={cn(
                    "rounded-lg p-4 border",
                    config.className
                  )}
                >
                  <div className="flex items-start gap-3">
                    <CategoryIcon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" strokeWidth={1.5} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground">{note.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{note.content}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          {notes.length} {notes.length === 1 ? 'insight' : 'insights'} captured
        </p>
      </div>
    </div>
  );
};

export default NotePanel;
