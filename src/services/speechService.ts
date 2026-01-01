// Speech-to-Text and Text-to-Speech service using Web Speech API
class SpeechService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private onTranscriptCallback: ((transcript: string, isFinal: boolean) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript && this.onTranscriptCallback) {
          this.onTranscriptCallback(finalTranscript, true);
        } else if (interimTranscript && this.onTranscriptCallback) {
          this.onTranscriptCallback(interimTranscript, false);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onEndCallback) {
          this.onEndCallback();
        }
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
      };
    }
  }

  startListening(
    onTranscript: (transcript: string, isFinal: boolean) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      console.error('Speech recognition not supported');
      return false;
    }

    this.onTranscriptCallback = onTranscript;
    this.onEndCallback = onEnd;

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      return false;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string, onEnd?: () => void): void {
    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    // Try to find a natural-sounding voice
    const voices = this.synthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural')
    ) || voices.find((v) => v.lang.startsWith('en'));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      if (onEnd) onEnd();
    };

    this.synthesis.speak(utterance);
  }

  stopSpeaking(): void {
    this.synthesis.cancel();
  }

  isSupported(): { stt: boolean; tts: boolean } {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    return {
      stt: !!SpeechRecognition,
      tts: 'speechSynthesis' in window,
    };
  }
}

export const speechService = new SpeechService();
