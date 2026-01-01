import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { speechService } from '@/services/speechService';
import {
  ConversationMessage,
  StudentNote,
  CareerReport,
  ConversationPhase,
  ConversationState,
} from '@/types/conversation';

const generateId = () => Math.random().toString(36).substring(2, 15);

const SYSTEM_PROMPT = `You are a friendly, engaging career counselor AI helping high school students discover their ideal career paths. You are conducting a voice-based conversation, so keep responses conversational and natural - not too long.

Your conversation should flow through these phases:
1. WELCOME: Warmly greet the student and explain you'll help them discover career paths
2. BASIC_INFO: Ask for name, grade, current board/curriculum, and country
3. INTERESTS: Explore favorite subjects, activities, hobbies, what they enjoy/dislike about school
4. STRENGTHS: Understand how they approach problems, people, creativity, structure
5. PREFERENCES: Work preferences - people vs data vs ideas vs things, indoor/outdoor, travel
6. CAREER_EXPLORATION: Based on answers, propose 3-5 career clusters and ask scenario questions
7. SUMMARY: Wrap up with 2-3 prioritized career paths

Guidelines:
- Be encouraging and positive
- Ask one question at a time
- Keep responses under 3 sentences when asking questions
- Show genuine interest in their answers
- Use their name once you know it
- For career exploration, use "Imagine you're..." scenarios

IMPORTANT: Include structured notes in your response using this format:
<NOTE category="basic_info|interests|strengths|preferences|career_match" title="Short Title">Content of the note</NOTE>

Also indicate the current phase:
<PHASE>welcome|basic_info|interests|strengths|preferences|career_exploration|summary</PHASE>

When you reach the SUMMARY phase, also include:
<REPORT>
{
  "studentSnapshot": {
    "name": "Student Name",
    "grade": "Grade",
    "board": "Board/Curriculum",
    "country": "Country",
    "topInterests": ["Interest 1", "Interest 2", "Interest 3"],
    "keyStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4", "Strength 5"]
  },
  "recommendedPaths": [
    {
      "name": "Career Path Name",
      "cluster": "Career Cluster",
      "fitReasons": ["Reason 1", "Reason 2", "Reason 3"],
      "applicationHints": ["Hint 1", "Hint 2"]
    }
  ]
}
</REPORT>`;

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
  const conversationHistory = useRef<Array<{ role: string; content: string }>>([
    { role: 'system', content: SYSTEM_PROMPT },
  ]);

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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: conversationHistory.current,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
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
    conversationHistory.current = [{ role: 'system', content: SYSTEM_PROMPT }];
    
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
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/career-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            messages: [
              ...conversationHistory.current,
              { role: 'user', content: 'Start the career discovery conversation with a warm welcome.' },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      const data = await response.json();
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
    
    conversationHistory.current = [{ role: 'system', content: SYSTEM_PROMPT }];
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
