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

const categoryIcons: Record<string, React.ElementType> = {
  basic_info: User,
  interests: Star,
  strengths: Gem,
  preferences: Target,
  career_match: Rocket,
};

const NotePanel: React.FC<NotePanelProps> = ({ notes, currentPhase }) => {
  const { label: phaseLabel, Icon: PhaseIcon } = phaseConfig[currentPhase];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
            <PhaseIcon className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">Discovery Notes</h2>
            <p className="text-xs text-muted-foreground">{phaseLabel}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
            initial={{ width: 0 }}
            animate={{
              width: `${(Object.keys(phaseConfig).indexOf(currentPhase) / (Object.keys(phaseConfig).length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center py-12"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="text-sm text-muted-foreground max-w-[180px]">
                Notes will appear here as we learn about you
              </p>
            </motion.div>
          ) : (
            notes.map((note, index) => {
              const CategoryIcon = categoryIcons[note.category] || FileText;

              return (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  className="note-card"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <CategoryIcon className="h-4 w-4 text-primary" strokeWidth={1.5} />
                    </div>
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
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-muted-foreground text-center">
          <span className="text-primary font-medium">{notes.length}</span> {notes.length === 1 ? 'insight' : 'insights'} captured
        </p>
      </div>
    </div>
  );
};

export default NotePanel;