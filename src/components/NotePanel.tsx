import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StudentNote, ConversationPhase } from '@/types/conversation';

interface NotePanelProps {
  notes: StudentNote[];
  currentPhase: ConversationPhase;
}

const phaseLabels: Record<ConversationPhase, { label: string; icon: string }> = {
  welcome: { label: 'Getting Started', icon: '👋' },
  basic_info: { label: 'Basic Information', icon: '📋' },
  interests: { label: 'Interests & Passions', icon: '💡' },
  strengths: { label: 'Strengths & Traits', icon: '💪' },
  preferences: { label: 'Work Preferences', icon: '⚙️' },
  career_exploration: { label: 'Career Exploration', icon: '🧭' },
  summary: { label: 'Creating Summary', icon: '📊' },
  complete: { label: 'Discovery Complete', icon: '✅' },
};

const categoryIcons: Record<string, string> = {
  basic_info: '👤',
  interests: '⭐',
  strengths: '💎',
  preferences: '🎯',
  career_match: '🚀',
};

const categoryColors: Record<string, string> = {
  basic_info: 'bg-blue-500/10 text-blue-600 border-blue-200',
  interests: 'bg-amber-500/10 text-amber-600 border-amber-200',
  strengths: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  preferences: 'bg-violet-500/10 text-violet-600 border-violet-200',
  career_match: 'bg-rose-500/10 text-rose-600 border-rose-200',
};

const NotePanel: React.FC<NotePanelProps> = ({ notes, currentPhase }) => {
  const phaseInfo = phaseLabels[currentPhase];

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{phaseInfo.icon}</span>
          <h2 className="font-semibold text-foreground">Discovery Notes</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${(Object.keys(phaseLabels).indexOf(currentPhase) / (Object.keys(phaseLabels).length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {phaseInfo.label}
          </span>
        </div>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence mode="popLayout">
          {notes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-center p-4"
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground">
                Notes will appear here as we learn about you
              </p>
            </motion.div>
          ) : (
            notes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={cn(
                  "rounded-xl p-3 border",
                  categoryColors[note.category] || 'bg-muted/50 border-border'
                )}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{categoryIcons[note.category] || '📝'}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{note.title}</h4>
                    <p className="text-xs mt-1 opacity-80 line-clamp-2">{note.content}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Note count footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          {notes.length} {notes.length === 1 ? 'insight' : 'insights'} captured
        </p>
      </div>
    </div>
  );
};

export default NotePanel;
