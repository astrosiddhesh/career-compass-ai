export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface StudentNote {
  id: string;
  category: 'basic_info' | 'interests' | 'strengths' | 'preferences' | 'career_match';
  title: string;
  content: string;
  timestamp: Date;
}

export interface CareerPath {
  name: string;
  cluster: string;
  fitReasons: string[];
  applicationHints: string[];
}

export interface StudentSnapshot {
  name: string;
  grade: string;
  board: string;
  country: string;
  topInterests: string[];
  keyStrengths: string[];
}

export interface CareerReport {
  studentSnapshot: StudentSnapshot;
  recommendedPaths: CareerPath[];
  generatedAt: Date;
}

export type ConversationPhase = 
  | 'welcome'
  | 'basic_info'
  | 'interests'
  | 'strengths'
  | 'preferences'
  | 'career_exploration'
  | 'summary'
  | 'complete';

export interface ConversationState {
  phase: ConversationPhase;
  messages: ConversationMessage[];
  notes: StudentNote[];
  report: CareerReport | null;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
}
