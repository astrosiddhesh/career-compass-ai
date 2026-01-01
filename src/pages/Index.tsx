import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VoiceOrb from '@/components/VoiceOrb';
import ConversationDisplay from '@/components/ConversationDisplay';
import NotePanel from '@/components/NotePanel';
import CareerReportView from '@/components/CareerReportView';
import { useConversation } from '@/hooks/useConversation';

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
    resetConversation,
  } = useConversation();

  const [hasStarted, setHasStarted] = useState(false);

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

  // Show report view when complete
  if (phase === 'complete' && report) {
    return <CareerReportView report={report} onRestart={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
              <span className="text-lg font-bold text-primary-foreground">CD</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold text-foreground">Career Discovery</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Guidance</p>
            </div>
          </div>
          
          {hasStarted && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Start Over
            </Button>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!hasStarted ? (
          /* Welcome Screen */
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-3xl" />
                <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary via-accent to-secondary">
                  <Play className="h-12 w-12 text-primary-foreground" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4 text-center font-display text-4xl font-bold text-foreground md:text-5xl"
            >
              Discover Your <span className="text-primary">Career Path</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 max-w-md text-center text-lg text-muted-foreground"
            >
              Have a voice conversation with our AI counselor to explore careers that match your interests, strengths, and goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                size="lg"
                onClick={handleStart}
                className="gap-2 bg-gradient-to-r from-primary to-accent px-8 py-6 text-lg font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
              >
                <Mic className="h-5 w-5" />
                Start Conversation
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 grid max-w-2xl grid-cols-3 gap-6 text-center"
            >
              {[
                { title: '10 min', subtitle: 'Conversation' },
                { title: 'AI-Powered', subtitle: 'Analysis' },
                { title: 'Personalized', subtitle: 'Report' },
              ].map((item, i) => (
                <div key={i} className="rounded-xl bg-card/50 p-4">
                  <div className="text-xl font-bold text-primary">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          /* Conversation Screen */
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-[calc(100vh-4rem)]"
          >
            {/* Main Conversation Area */}
            <div className="flex flex-1 flex-col">
              {/* Voice Orb Section */}
              <div className="flex flex-1 flex-col items-center justify-center p-8">
                <VoiceOrb
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isProcessing={isProcessing}
                  onClick={handleMicToggle}
                />

                <div className="mt-8 h-20 text-center">
                  {currentTranscript && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg text-muted-foreground italic"
                    >
                      "{currentTranscript}"
                    </motion.p>
                  )}
                  {isProcessing && (
                    <p className="text-muted-foreground">Thinking...</p>
                  )}
                  {isSpeaking && (
                    <p className="text-primary">Speaking...</p>
                  )}
                </div>

                {/* Mic Button */}
                <Button
                  size="lg"
                  variant={isListening ? 'destructive' : 'default'}
                  onClick={handleMicToggle}
                  disabled={isProcessing || isSpeaking}
                  className="mt-4 gap-2 px-8"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-5 w-5" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      Speak
                    </>
                  )}
                </Button>
              </div>

              {/* Conversation History */}
              <div className="border-t border-border/50 bg-card/30">
                <ConversationDisplay
                  messages={messages}
                  currentTranscript={currentTranscript}
                  isListening={isListening}
                />
              </div>
            </div>

            {/* Notes Side Panel */}
            <div className="hidden w-80 border-l border-border/50 bg-card/30 lg:block xl:w-96">
              <NotePanel notes={notes} currentPhase={phase} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
