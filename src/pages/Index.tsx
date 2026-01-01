import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, Mic, MicOff, Send, Keyboard } from 'lucide-react';
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
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground">
              <span className="text-sm font-semibold text-background">CD</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground tracking-tight">Career Discovery</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Guidance</p>
            </div>
          </div>
          
          {hasStarted && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>
      </header>

      {/* Progress Tracker */}
      {hasStarted && phase !== 'complete' && (
        <div className="border-b border-border bg-card">
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
            className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6"
          >
            <div className="max-w-xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="w-20 h-20 mx-auto rounded-2xl bg-foreground flex items-center justify-center mb-8">
                  <Mic className="h-8 w-8 text-background" strokeWidth={1.5} />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight mb-4"
              >
                Discover Your Path
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground mb-12 max-w-md mx-auto leading-relaxed"
              >
                Have a conversation with our AI counselor to explore careers that match your unique profile.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={handleStart}
                  className="gap-3 px-8 py-6 text-base font-medium bg-foreground text-background hover:bg-foreground/90"
                >
                  Begin Discovery
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-16 flex justify-center gap-12 text-center"
              >
                {[
                  { value: '10 min', label: 'Conversation' },
                  { value: 'AI', label: 'Analysis' },
                  { value: 'Custom', label: 'Report' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="text-lg font-semibold text-foreground">{item.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
                  </div>
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
            className="flex h-[calc(100vh-8rem)]"
          >
            {/* Main Conversation Area */}
            <div className="flex flex-1 flex-col">
              {/* Voice Orb Section */}
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
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
                    <p className="text-muted-foreground text-sm">Processing...</p>
                  )}
                  {isSpeaking && (
                    <p className="text-foreground text-sm">Speaking...</p>
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
                        className="flex-1 h-11"
                      />
                      <Button
                        type="submit"
                        disabled={!textInput.trim() || isProcessing || isSpeaking}
                        className="h-11 px-4"
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
                      className="gap-2 px-6"
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

              {/* Conversation History */}
              <div className="border-t border-border bg-card h-48">
                <ConversationDisplay
                  messages={messages}
                  currentTranscript={currentTranscript}
                  isListening={isListening}
                />
              </div>
            </div>

            {/* Notes Side Panel */}
            <div className="hidden w-80 border-l border-border lg:block xl:w-96">
              <NotePanel notes={notes} currentPhase={phase} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
