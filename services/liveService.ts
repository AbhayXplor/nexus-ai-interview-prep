
import { GoogleGenAI, Modality, Blob } from '@google/genai';

// Fix: Implemented manual encode function following SDK guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Fix: Implemented manual decode function following SDK guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export interface LiveHandlers {
  onAudioData: (data: Uint8Array) => void;
  onTranscription: (text: string, isUser: boolean) => void;
  onInterrupted: () => void;
  onError: (error: any) => void;
}

export const connectToLiveAI = async (handlers: LiveHandlers, systemInstruction: string) => {
  // Fix: Ensure GoogleGenAI is initialized with named parameter and direct process.env.API_KEY access
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
        
        scriptProcessor.onaudioprocess = (e) => {
          const inputData = e.inputBuffer.getChannelData(0);
          const l = inputData.length;
          const int16 = new Int16Array(l);
          for (let i = 0; i < l; i++) {
            int16[i] = inputData[i] * 32768;
          }
          
          // Fix: Use the custom encode function for PCM audio data
          const pcmBlob: Blob = {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
          };
          
          // CRITICAL: Solely rely on sessionPromise resolves to send input
          sessionPromise.then(session => {
            session.sendRealtimeInput({ media: pcmBlob });
          });
        };
        
        source.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
      },
      onmessage: async (message) => {
        // Fix: Use the custom decode function for incoming audio bytes
        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          handlers.onAudioData(decode(base64Audio));
        }
        
        if (message.serverContent?.outputTranscription) {
          handlers.onTranscription(message.serverContent.outputTranscription.text, false);
        } else if (message.serverContent?.inputTranscription) {
          handlers.onTranscription(message.serverContent.inputTranscription.text, true);
        }
        
        if (message.serverContent?.interrupted) {
          handlers.onInterrupted();
        }
      },
      onerror: (e) => handlers.onError(e),
      onclose: () => console.log('Live session closed'),
    },
    config: {
      responseModalities: [Modality.AUDIO],
      outputAudioTranscription: {},
      inputAudioTranscription: {},
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction,
    },
  });

  return sessionPromise;
};

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
