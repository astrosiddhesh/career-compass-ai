import { useState, useCallback, useRef } from 'react';
import { speechService } from '@/services/speechService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  ConversationMessage,
  StudentNote,
  CareerReport,
  ConversationPhase,
  ConversationState,
} from '@/types/conversation';

const generateId = () => Math.random().toString(36).substring(2, 15);

export function useConversation() {
  const [state, setState] = useState<ConversationState>({
    phase: 'welcome',
    messages: [],
    notes: [],
    report: null,
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
  });

  const [currentTranscript, setCurrentTranscript] = useState('');
  const conversationHistory = useRef<Array<{ role: string; content: string }>>([]);

  const parseAIResponse = useCallback((response: string) => {
    const notes: StudentNote[] = [];
    let phase: ConversationPhase = state.phase;
    let report: CareerReport | null = null;
    let cleanedResponse = response;

    // Extract notes
    const noteRegex = /<NOTE category="([^"]+)" title="([^"]+)">([^<]+)<\/NOTE>/g;
    let noteMatch;
    while ((noteMatch = noteRegex.exec(response)) !== null) {
      notes.push({
        id: generateId(),
        category: noteMatch[1] as StudentNote['category'],
        title: noteMatch[2],
        content: noteMatch[3].trim(),
        timestamp: new Date(),
      });
    }
    cleanedResponse = cleanedResponse.replace(noteRegex, '');

    // Extract phase
    const phaseMatch = response.match(/<PHASE>([^<]+)<\/PHASE>/);
    if (phaseMatch) {
      phase = phaseMatch[1] as ConversationPhase;
      cleanedResponse = cleanedResponse.replace(/<PHASE>[^<]+<\/PHASE>/, '');
    }

    // Extract report
    const reportMatch = response.match(/<REPORT>([\s\S]*?)<\/REPORT>/);
    if (reportMatch) {
      try {
        const reportData = JSON.parse(reportMatch[1]);
        report = {
          ...reportData,
          generatedAt: new Date(),
        };
      } catch (e) {
        console.error('Error parsing report:', e);
      }
      cleanedResponse = cleanedResponse.replace(/<REPORT>[\s\S]*?<\/REPORT>/, '');
    }

    return {
      text: cleanedResponse.trim(),
      notes,
      phase,
      report,
    };
  }, [state.phase]);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    // Add user message
    const userMsg: ConversationMessage = {
      id: generateId(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isProcessing: true,
    }));

    conversationHistory.current.push({ role: 'user', content: userMessage });

    try {
      const { data, error } = await supabase.functions.invoke('career-chat', {
        body: { messages: conversationHistory.current },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiResponse = data.response;
      conversationHistory.current.push({ role: 'assistant', content: aiResponse });

      const parsed = parseAIResponse(aiResponse);

      const assistantMsg: ConversationMessage = {
        id: generateId(),
        role: 'assistant',
        content: parsed.text,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMsg],
        notes: [...prev.notes, ...parsed.notes],
        phase: parsed.phase,
        report: parsed.report || prev.report,
        isProcessing: false,
        isSpeaking: true,
      }));

      // Speak the response
      speechService.speak(parsed.text, () => {
        setState((prev) => ({ ...prev, isSpeaking: false }));
        
        // If report is generated, move to complete phase
        if (parsed.report) {
          setState((prev) => ({ ...prev, phase: 'complete' }));
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get response');
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  }, [parseAIResponse]);

  const startListening = useCallback(() => {
    const success = speechService.startListening(
      (transcript, isFinal) => {
        setCurrentTranscript(transcript);
        if (isFinal) {
          sendMessage(transcript);
          setCurrentTranscript('');
          setState((prev) => ({ ...prev, isListening: false }));
        }
      },
      () => {
        setState((prev) => ({ ...prev, isListening: false }));
      }
    );

    if (success) {
      setState((prev) => ({ ...prev, isListening: true }));
    } else {
      const supported = speechService.isSupported().stt;
      toast.error(
        supported
          ? 'Could not start the microphone. Please wait a moment and try again.'
          : 'Speech recognition is not supported in this browser.'
      );
    }
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    speechService.stopListening();
    setState((prev) => ({ ...prev, isListening: false }));
    
    // If there's a transcript, send it
    if (currentTranscript.trim()) {
      sendMessage(currentTranscript);
      setCurrentTranscript('');
    }
  }, [currentTranscript, sendMessage]);

  const startConversation = useCallback(async () => {
    // Reset state
    conversationHistory.current = [];
    
    setState({
      phase: 'welcome',
      messages: [],
      notes: [],
      report: null,
      isListening: false,
      isSpeaking: false,
      isProcessing: true,
    });

    // Get initial greeting from AI
    try {
      const { data, error } = await supabase.functions.invoke('career-chat', {
        body: {
          messages: [
            { role: 'user', content: 'Start the career discovery conversation with a warm welcome.' },
          ],
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to start conversation');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiResponse = data.response;
      conversationHistory.current.push({ role: 'assistant', content: aiResponse });

      const parsed = parseAIResponse(aiResponse);

      const assistantMsg: ConversationMessage = {
        id: generateId(),
        role: 'assistant',
        content: parsed.text,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [assistantMsg],
        phase: parsed.phase,
        isProcessing: false,
        isSpeaking: true,
      }));

      speechService.speak(parsed.text, () => {
        setState((prev) => ({ ...prev, isSpeaking: false }));
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start conversation');
      setState((prev) => ({ ...prev, isProcessing: false }));
    }
  }, [parseAIResponse]);

  const resetConversation = useCallback(() => {
    speechService.stopSpeaking();
    speechService.stopListening();
    
    setState({
      phase: 'welcome',
      messages: [],
      notes: [],
      report: null,
      isListening: false,
      isSpeaking: false,
      isProcessing: false,
    });
    
    conversationHistory.current = [];
    setCurrentTranscript('');
  }, []);

  return {
    ...state,
    currentTranscript,
    startConversation,
    startListening,
    stopListening,
    sendMessage,
    resetConversation,
  };
}
