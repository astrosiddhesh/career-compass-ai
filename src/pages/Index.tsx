import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Mic, MicOff, Send, Keyboard, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-xl bg-background/50">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground tracking-tight">Career Discovery</h1>
              <p className="text-xs text-muted-foreground">Your AI-Powered Guide</p>
            </div>
          </div>
          
          {hasStarted && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset} 
              className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>
      </header>

      {/* Progress Tracker */}
      {hasStarted && phase !== 'complete' && (
        <div className="relative border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <ProgressTracker currentPhase={phase} />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          /* Welcome Screen */
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6"
          >
            <div className="max-w-xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mb-10"
              >
                <div className="relative w-28 h-28 mx-auto">
                  <div className="absolute inset-0 rounded-full orb-glow animate-pulse-glow" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-primary via-primary-light to-accent flex items-center justify-center">
                    <Sparkles className="h-12 w-12 text-primary-foreground" strokeWidth={1.5} />
                  </div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm font-medium text-primary mb-4 uppercase tracking-widest"
              >
                Meet Your AI Guide
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6"
              >
                Discover Your
                <span className="block gradient-text">Perfect Career</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed"
              >
                Have a voice conversation with our AI counselor and unlock career paths tailored to your unique strengths.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="gap-3 px-8 py-6 text-base font-medium btn-primary rounded-2xl"
                >
                  Start Discovery
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-16 flex justify-center gap-8 md:gap-16"
              >
                {[
                  { value: '10 min', label: 'Conversation' },
                  { value: 'AI', label: 'Analysis' },
                  { value: 'Custom', label: 'Report' },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-xl font-bold gradient-text">{item.value}</div>
                    <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{item.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* Conversation Screen */
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative flex h-[calc(100vh-8rem)]"
          >
            {/* Main Conversation Area */}
            <div className="flex flex-1 flex-col">
              {/* Voice Orb Section */}
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
                <VoiceOrb
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isProcessing={isProcessing}
                  onClick={handleMicToggle}
                />

                <div className="mt-8 h-16 text-center">
                  {currentTranscript && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-base text-muted-foreground"
                    >
                      "{currentTranscript}"
                    </motion.p>
                  )}
                  {isProcessing && (
                    <p className="text-primary text-sm animate-pulse-subtle">Thinking...</p>
                  )}
                  {isSpeaking && (
                    <p className="text-accent text-sm">Speaking...</p>
                  )}
                </div>

                {/* Input Controls */}
                <div className="flex flex-col items-center gap-4 mt-4">
                  {useTextInput || !speechSupport.stt ? (
                    <form onSubmit={handleTextSubmit} className="flex w-full max-w-md gap-3">
                      <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Type your response..."
                        disabled={isProcessing || isSpeaking}
                        className="flex-1 h-12 bg-card/50 border-border/50 rounded-xl focus:border-primary/50 focus:ring-primary/20"
                      />
                      <Button
                        type="submit"
                        disabled={!textInput.trim() || isProcessing || isSpeaking}
                        className="h-12 px-5 btn-primary rounded-xl"
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
                      className="text-muted-foreground hover:text-foreground text-xs hover:bg-muted/30"
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

              {/* Conversation History */}
              <div className="border-t border-border/50 bg-card/30 backdrop-blur-sm h-52">
                <ConversationDisplay
                  messages={messages}
                  currentTranscript={currentTranscript}
                  isListening={isListening}
                />
              </div>
            </div>

            {/* Notes Side Panel */}
            <div className="hidden w-80 border-l border-border/50 lg:block xl:w-96">
              <NotePanel notes={notes} currentPhase={phase} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
