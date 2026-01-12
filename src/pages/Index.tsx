import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Mic, MicOff, Send, Keyboard, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoiceOrb from '@/components/VoiceOrb';
import ConversationDisplay from '@/components/ConversationDisplay';
import NotePanel from '@/components/NotePanel';
import CareerReportView from '@/components/CareerReportView';
import ProgressTracker from '@/components/ProgressTracker';
import { useConversation } from '@/hooks/useConversation';
import { speechService } from '@/services/speechService';

const Index = () => {
  const {
    phase,
    messages,
    notes,
    report,
    isListening,
    isSpeaking,
    isProcessing,
    currentTranscript,
    startConversation,
    startListening,
    stopListening,
    sendMessage,
    resetConversation,
  } = useConversation();

  const [hasStarted, setHasStarted] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [useTextInput, setUseTextInput] = useState(false);
  
  const speechSupport = speechService.isSupported();

  const handleStart = () => {
    setHasStarted(true);
    startConversation();
  };

  const handleReset = () => {
    setHasStarted(false);
    resetConversation();
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim() && !isProcessing) {
      sendMessage(textInput.trim());
      setTextInput('');
    }
  };

  // Show report view when complete
  if (phase === 'complete' && report) {
    return <CareerReportView report={report} onRestart={handleReset} />;
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {!hasStarted ? (
          /* Welcome Screen */
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex min-h-screen flex-col items-center justify-center px-6"
          >
            <div className="max-w-xl mx-auto text-center">
              {/* Decorative sparkles */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-center gap-2 mb-8"
              >
                <Sparkles className="w-5 h-5 text-primary/60 animate-sparkle" />
                <Sparkles className="w-4 h-4 text-primary/40 animate-sparkle" style={{ animationDelay: '0.3s' }} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg md:text-xl text-foreground mb-2"
              >
                Meet
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <span className="fancy-title text-5xl md:text-6xl lg:text-7xl gradient-text-fancy">
                  Career Guide
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground mb-16"
              >
                Your Daily AI Vibe Agent
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-16"
              >
                <div className="relative w-48 h-48 mx-auto animate-float">
                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-primary-light/20 blur-3xl scale-150" />
                  
                  {/* Main orb preview */}
                  <div className="relative w-full h-full rounded-full orb-glow">
                    <div className="orb-inner" />
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/40 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-white/80" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-3"
              >
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="w-full max-w-xs gap-3 px-8 py-6 text-base font-medium btn-primary rounded-2xl"
                >
                  <Mic className="w-5 h-5" />
                  Start Conversation
                </Button>
                
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleStart}
                  className="w-full max-w-xs gap-3 px-8 py-6 text-base font-medium btn-secondary rounded-2xl"
                >
                  I have questions
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Conversation Screen */
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative min-h-screen flex"
          >
            {/* Main Conversation Area */}
            <div className="flex flex-1 flex-col">
              {/* Header */}
              <header className="flex items-center justify-between px-6 py-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleReset} 
                  className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-foreground/10"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <h1 className="text-sm font-medium text-foreground">Voice agents</h1>

                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </Button>
              </header>

              {/* Progress Tracker */}
              {phase !== 'complete' && (
                <div className="px-6">
                  <ProgressTracker currentPhase={phase} />
                </div>
              )}

              {/* Conversation Text Display */}
              <div className="flex-1 px-6 py-4 overflow-hidden">
                <ConversationDisplay
                  messages={messages}
                  currentTranscript={currentTranscript}
                  isListening={isListening}
                />
              </div>

              {/* Voice Orb Section */}
              <div className="flex flex-col items-center px-6 py-8">
                <VoiceOrb
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isProcessing={isProcessing}
                  onClick={handleMicToggle}
                />

                {/* Input Controls */}
                <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-md">
                  {useTextInput || !speechSupport.stt ? (
                    <form onSubmit={handleTextSubmit} className="flex w-full gap-3">
                      <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type your response..."
                        disabled={isProcessing || isSpeaking}
                        className="flex-1 h-12 bg-white/60 backdrop-blur-sm border-white/50 rounded-xl focus:border-primary/40 focus:ring-primary/20"
                      />
                      <Button
                        type="submit"
                        disabled={!textInput.trim() || isProcessing || isSpeaking}
                        className="h-12 w-12 btn-primary rounded-xl"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  ) : (
                    <Button
                      size="lg"
                      variant={isListening ? 'destructive' : 'default'}
                      onClick={handleMicToggle}
                      disabled={isProcessing || isSpeaking}
                      className={`gap-2 px-8 rounded-xl ${!isListening ? 'btn-primary' : ''}`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4" />
                          Speak
                        </>
                      )}
                    </Button>
                  )}

                  {speechSupport.stt && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUseTextInput(!useTextInput)}
                      className="text-muted-foreground hover:text-foreground text-xs"
                    >
                      {useTextInput ? (
                        <>
                          <Mic className="mr-2 h-3 w-3" />
                          Switch to Voice
                        </>
                      ) : (
                        <>
                          <Keyboard className="mr-2 h-3 w-3" />
                          Switch to Typing
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Notes Side Panel */}
            <div className="hidden w-80 lg:block xl:w-96 border-l border-border/50 bg-white/30 backdrop-blur-xl">
              <NotePanel notes={notes} currentPhase={phase} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;