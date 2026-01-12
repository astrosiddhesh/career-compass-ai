import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mic, MicOff, Send, Keyboard, Sparkles, MoreVertical, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import VoiceOrb from '@/components/VoiceOrb';
import BotAvatar from '@/components/BotAvatar';
import AbstractOrb from '@/components/AbstractOrb';
import ConversationDisplay from '@/components/ConversationDisplay';
import NotePanel from '@/components/NotePanel';
import CareerReportView from '@/components/CareerReportView';
import ProgressTracker from '@/components/ProgressTracker';
import { useConversation } from '@/hooks/useConversation';
import { speechService } from '@/services/speechService';

type BotType = 'neo' | 'neha' | null;
type ViewMode = 'selection' | 'conversation' | 'voice';

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

  const [selectedBot, setSelectedBot] = useState<BotType>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('selection');
  const [textInput, setTextInput] = useState('');
  const [useVoiceMode, setUseVoiceMode] = useState(false);
  
  const speechSupport = speechService.isSupported();

  const handleBotSelect = (bot: BotType) => {
    setSelectedBot(bot);
  };

  const handleStart = () => {
    if (selectedBot) {
      setViewMode('conversation');
      startConversation();
    }
  };

  const handleReset = () => {
    setViewMode('selection');
    setSelectedBot(null);
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

  const toggleVoiceMode = () => {
    setUseVoiceMode(!useVoiceMode);
  };

  const botName = selectedBot === 'neo' ? 'Neo' : 'Neha';

  // Show report view when complete
  if (phase === 'complete' && report) {
    return <CareerReportView report={report} onRestart={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/50 to-white">
      <AnimatePresence mode="wait">
        {viewMode === 'selection' ? (
          /* Bot Selection Screen */
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col px-4 py-8 md:px-8"
          >
            <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8 md:mb-12"
              >
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">Career Discovery</span>
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                  Choose Your Guide
                </h1>
                <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto">
                  Select an AI companion to help you discover your perfect career path
                </p>
              </motion.div>

              {/* Bot Selection Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8"
              >
                {/* Neo Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBotSelect('neo')}
                  className={`bot-card flex flex-col items-center text-center ${selectedBot === 'neo' ? 'selected' : ''}`}
                >
                  <BotAvatar variant="neo" size="lg" isActive={selectedBot === 'neo'} showGlow={selectedBot === 'neo'} />
                  <h3 className="text-xl font-semibold mt-4 mb-2">Neo</h3>
                  <p className="text-sm text-muted-foreground">
                    Analytical & Strategic. Great for tech, business, and data-driven careers.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <span className="chip">Tech</span>
                    <span className="chip">Analytics</span>
                    <span className="chip">Strategy</span>
                  </div>
                </motion.div>

                {/* Neha Card */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleBotSelect('neha')}
                  className={`bot-card flex flex-col items-center text-center ${selectedBot === 'neha' ? 'selected' : ''}`}
                >
                  <BotAvatar variant="neha" size="lg" isActive={selectedBot === 'neha'} showGlow={selectedBot === 'neha'} />
                  <h3 className="text-xl font-semibold mt-4 mb-2">Neha</h3>
                  <p className="text-sm text-muted-foreground">
                    Creative & Empathetic. Perfect for arts, healthcare, and people-focused roles.
                  </p>
                  <div className="flex gap-2 mt-4">
                    <span className="chip">Creative</span>
                    <span className="chip">Healthcare</span>
                    <span className="chip">Social</span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Start Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-auto"
              >
                <Button
                  size="lg"
                  onClick={handleStart}
                  disabled={!selectedBot}
                  className={`w-full py-6 text-base font-medium rounded-2xl transition-all duration-300 ${
                    selectedBot ? 'btn-primary' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedBot ? `Start with ${botName}` : 'Select a guide to continue'}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ) : useVoiceMode ? (
          /* Voice Mode Screen */
          <motion.div
            key="voice"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-4 md:px-6">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setUseVoiceMode(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <h1 className="text-sm font-medium text-foreground">Speaking to {botName}</h1>

              <Button 
                variant="ghost" 
                size="icon"
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
              <p className="text-sm text-muted-foreground mb-6">Go ahead, I'm listening...</p>
              
              {/* Abstract Orb Visualization */}
              <div className="mb-8">
                <AbstractOrb 
                  isListening={isListening} 
                  isSpeaking={isSpeaking}
                  isProcessing={isProcessing}
                  size="lg" 
                />
              </div>

              {/* Transcript Display */}
              <div className="max-w-md text-center mb-8 min-h-[120px]">
                {currentTranscript && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xl md:text-2xl font-medium text-foreground"
                  >
                    {currentTranscript}
                  </motion.p>
                )}
                {messages.length > 0 && !currentTranscript && (
                  <p className="text-xl md:text-2xl text-foreground">
                    {messages[messages.length - 1]?.content.slice(0, 100)}
                    {messages[messages.length - 1]?.content.length > 100 ? '...' : ''}
                  </p>
                )}
              </div>

              {/* Voice Controls */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setUseVoiceMode(false)}
                  className="w-12 h-12 rounded-full border-gray-200"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  onClick={handleMicToggle}
                  disabled={isProcessing || isSpeaking}
                  className={`w-16 h-16 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'}`}
                >
                  {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleReset}
                  className="w-12 h-12 rounded-full border-gray-200"
                >
                  <span className="text-lg">✕</span>
                </Button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Chat Mode Screen */
          <motion.div
            key="conversation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col lg:flex-row"
          >
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
              {/* Header */}
              <header className="flex items-center justify-between px-4 py-3 md:px-6 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={handleReset}
                  className="w-10 h-10 rounded-full hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <div className="flex items-center gap-2">
                  <BotAvatar variant={selectedBot || 'neo'} size="sm" />
                  <span className="font-medium">{botName} AI</span>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon"
                  className="w-10 h-10 rounded-full hover:bg-gray-100"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </header>

              {/* Progress Tracker */}
              {phase !== 'complete' && (
                <div className="px-4 md:px-6 py-2 border-b border-gray-50 bg-white/50">
                  <ProgressTracker currentPhase={phase} />
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
                <ConversationDisplay
                  messages={messages}
                  currentTranscript={currentTranscript}
                  isListening={isListening}
                />
              </div>

              {/* Input Area */}
              <div className="px-4 md:px-6 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
                <form onSubmit={handleTextSubmit} className="flex items-center gap-3">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type something..."
                    disabled={isProcessing || isSpeaking}
                    className="flex-1 input-chat"
                  />
                  
                  {speechSupport.stt && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={toggleVoiceMode}
                      className="w-10 h-10 rounded-full hover:bg-gray-100"
                    >
                      <Mic className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={!textInput.trim() || isProcessing || isSpeaking}
                    size="icon"
                    className="w-10 h-10 rounded-full btn-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Notes Side Panel - Desktop only */}
            <div className="hidden lg:block w-80 xl:w-96 border-l border-gray-100 bg-gray-50/50">
              <NotePanel notes={notes} currentPhase={phase} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;