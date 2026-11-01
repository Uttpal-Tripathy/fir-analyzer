import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2, Mic, MicOff, Globe, MapPin, ExternalLink, Radio, Volume2, Sparkles, Zap, Brain } from 'lucide-react';
import { GroundingLink } from '../types';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  groundingLinks?: GroundingLink[];
  modelUsed?: string;
}

interface ChatbotProps {
  firContext: string;
}

export function Chatbot({ firContext }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'live'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Model & Grounding selectors
  const [modelMode, setModelMode] = useState<'fast' | 'general' | 'complex'>('general');
  const [groundingMode, setGroundingMode] = useState<'none' | 'search' | 'maps'>('none');
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  // Audio Transcription (gemini-3.5-transcribe) state
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isTranscribingMic, setIsTranscribingMic] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Gemini Live API (gemini-3.8-live) real-time voice state
  const [liveConnected, setLiveConnected] = useState(false);
  const [liveConnecting, setLiveConnecting] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveUserTranscript, setLiveUserTranscript] = useState('');
  const [liveModelTranscript, setLiveModelTranscript] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Request geolocation when Maps grounding is enabled
  useEffect(() => {
    if (groundingMode === 'maps' && !userCoords && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        () => {
          // Default to New Delhi if geolocation permission is declined
          setUserCoords({ latitude: 28.6139, longitude: 77.209 });
        }
      );
    }
  }, [groundingMode, userCoords]);

  // Clean up Live Voice session on unmount or drawer close
  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  const toggleMicTranscription = async () => {
    if (isRecordingMic) {
      mediaRecorderRef.current?.stop();
      setIsRecordingMic(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        if (blob.size === 0) return;

        setIsTranscribingMic(true);
        try {
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });

          const response = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioData: base64Audio,
              mimeType: blob.type || 'audio/webm',
            }),
          });
          const data = await response.json();
          if (response.ok && data.transcript) {
            setInput((prev) => (prev ? `${prev.trim()} ${data.transcript}` : data.transcript));
          }
        } catch (err) {
          console.error('Transcription error:', err);
        } finally {
          setIsTranscribingMic(false);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecordingMic(true);
    } catch (err) {
      console.error('Mic access denied:', err);
    }
  };

  // Start Real-time Gemini Live Voice Session (gemini-3.8-live)
  const startLiveSession = async () => {
    setLiveError(null);
    setLiveConnecting(true);
    setLiveUserTranscript('');
    setLiveModelTranscript('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass({ sampleRate: 24000 });
      audioCtxRef.current = audioCtx;
      nextStartTimeRef.current = audioCtx.currentTime;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const ws = new WebSocket(`${protocol}//${window.location.host}/live`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (firContext) {
          ws.send(JSON.stringify({ type: 'context', text: firContext }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'status' && msg.status === 'connected') {
            setLiveConnected(true);
            setLiveConnecting(false);
            beginStreamingMicrophone(stream, ws);
          } else if (msg.type === 'audio' && msg.data) {
            playPcm24kAudio(msg.data);
          } else if (msg.type === 'input_transcription' && msg.text) {
            setLiveUserTranscript((prev) => (prev + ' ' + msg.text).trim().slice(-260));
          } else if (msg.type === 'output_transcription' && msg.text) {
            setLiveModelTranscript((prev) => (prev + ' ' + msg.text).trim().slice(-320));
          } else if (msg.type === 'interrupted') {
            activeSourcesRef.current.forEach((src) => {
              try {
                src.stop();
              } catch {}
            });
            activeSourcesRef.current = [];
            if (audioCtxRef.current) {
              nextStartTimeRef.current = audioCtxRef.current.currentTime;
            }
          } else if (msg.type === 'error') {
            setLiveError(msg.message || 'Live voice error');
            stopLiveSession();
          }
        } catch (e) {
          console.error('Error parsing Live message:', e);
        }
      };

      ws.onerror = () => {
        setLiveError('WebSocket connection failed.');
        stopLiveSession();
      };

      ws.onclose = () => {
        setLiveConnected(false);
        setLiveConnecting(false);
      };
    } catch (err: any) {
      setLiveError(err.message || 'Microphone access is required for Live Voice.');
      setLiveConnecting(false);
    }
  };

  const beginStreamingMicrophone = (stream: MediaStream, ws: WebSocket) => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const inputCtx = new AudioContextClass({ sampleRate: 16000 });
    const source = inputCtx.createMediaStreamSource(stream);
    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      if (ws.readyState !== WebSocket.OPEN) return;
      const float32Data = e.inputBuffer.getChannelData(0);
      const int16Data = new Int16Array(float32Data.length);
      for (let i = 0; i < float32Data.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Data[i]));
        int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }
      const bytes = new Uint8Array(int16Data.buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Pcm = btoa(binary);
      ws.send(JSON.stringify({ type: 'audio', data: base64Pcm }));
    };

    source.connect(processor);
    processor.connect(inputCtx.destination);
  };

  const playPcm24kAudio = (base64Data: string) => {
    const audioCtx = audioCtxRef.current;
    if (!audioCtx) return;

    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32768.0;
    }

    const buffer = audioCtx.createBuffer(1, float32Array.length, 24000);
    buffer.getChannelData(0).set(float32Array);

    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);

    const startTime = Math.max(audioCtx.currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;
    activeSourcesRef.current.push(source);
  };

  const stopLiveSession = () => {
    setLiveConnected(false);
    setLiveConnecting(false);

    if (processorRef.current) {
      try {
        processorRef.current.disconnect();
      } catch {}
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch {}
      wsRef.current = null;
    }
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
      } catch {}
    });
    activeSourcesRef.current = [];
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRecordingMic) {
      mediaRecorderRef.current?.stop();
      setIsRecordingMic(false);
    }

    if (!input.trim()) return;

    const userMessage = input.trim();
    const priorHistory = [...messages];
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: priorHistory,
          firContext,
          modelMode,
          groundingMode,
          latLng: userCoords,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.details || data?.error || 'Failed to send message');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply,
          groundingLinks: data.groundingLinks,
          modelUsed: data.modelUsed,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${err.message || 'Connection Error. Unable to reach AI systems. Please try again.'}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 z-50 flex items-center justify-center print:hidden"
          title="Open LEIU Forensic AI Copilot"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-88 md:w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl flex flex-col z-50 h-[560px] overflow-hidden print:hidden">
          {/* Header */}
          <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center shrink-0">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <div>
                <span className="font-bold text-sm tracking-wide block leading-none">LEIU AI Copilot</span>
                <span className="text-[10px] text-slate-400">Multi-Turn • Search & Maps • Live Voice</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'live') stopLiveSession();
                  setActiveTab(activeTab === 'chat' ? 'live' : 'chat');
                }}
                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                  activeTab === 'live'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Radio className="w-3 h-3" />
                <span>{activeTab === 'live' ? 'Text Chat' : 'Live Voice'}</span>
              </button>
              <button
                onClick={() => {
                  stopLiveSession();
                  setIsOpen(false);
                }}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {activeTab === 'chat' ? (
            <>
              {/* Model & Grounding Toolbar */}
              <div className="bg-slate-100 dark:bg-slate-950 px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[10px] shrink-0">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-400 uppercase mr-1">Mode:</span>
                  <button
                    type="button"
                    onClick={() => setModelMode('fast')}
                    className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                      modelMode === 'fast'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title="Fast low-latency responses (gemini-3.1-flash-lite)"
                  >
                    <Zap className="w-2.5 h-2.5" /> Fast
                  </button>
                  <button
                    type="button"
                    onClick={() => setModelMode('general')}
                    className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                      modelMode === 'general'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title="Balanced general intelligence (gemini-3.8-flash)"
                  >
                    <Sparkles className="w-2.5 h-2.5" /> General
                  </button>
                  <button
                    type="button"
                    onClick={() => setModelMode('complex')}
                    className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 ${
                      modelMode === 'complex'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title="Deep legal reasoning mode"
                  >
                    <Brain className="w-2.5 h-2.5" /> Complex
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setGroundingMode(groundingMode === 'search' ? 'none' : 'search')}
                    className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 border ${
                      groundingMode === 'search'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Enable Google Search Grounding"
                  >
                    <Globe className="w-2.5 h-2.5" /> Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroundingMode(groundingMode === 'maps' ? 'none' : 'maps')}
                    className={`px-2 py-0.5 rounded font-semibold flex items-center gap-1 border ${
                      groundingMode === 'maps'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                    title="Enable Google Maps Grounding"
                  >
                    <MapPin className="w-2.5 h-2.5" /> Maps
                  </button>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950">
                {messages.length === 0 && (
                  <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6 space-y-2">
                    <p className="font-semibold text-slate-600 dark:text-slate-300">
                      Ask questions about the active FIR, BNS sections, or nearby emergency facilities.
                    </p>
                    <p className="text-[11px]">
                      Toggle <strong>Search</strong> for live web/legal citations or <strong>Maps</strong> for police stations & hospitals.
                    </p>
                  </div>
                )}

                {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-sm whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm'
                      }`}
                    >
                      {msg.content}

                      {/* Render Grounding Source & Map Links */}
                      {msg.groundingLinks && msg.groundingLinks.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Grounded References:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.groundingLinks.map((link, lIdx) => (
                              <a
                                key={lIdx}
                                href={link.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:underline border border-slate-200 dark:border-slate-700"
                              >
                                {link.type === 'maps' ? <MapPin className="w-3 h-3 shrink-0" /> : <Globe className="w-3 h-3 shrink-0" />}
                                <span className="truncate max-w-[180px]">{link.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 shadow-sm flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-xs text-slate-500">Analyzing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shrink-0">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      isRecordingMic
                        ? 'Recording audio...'
                        : isTranscribingMic
                        ? 'Transcribing audio...'
                        : 'Message Copilot (Any language)...'
                    }
                    className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm rounded-full pl-4 pr-20 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-2 flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={toggleMicTranscription}
                      disabled={isTranscribingMic}
                      className={`p-1.5 rounded-full transition-colors ${
                        isRecordingMic
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/40'
                          : 'text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                      title="Transcribe voice message with Gemini Audio Transcription"
                    >
                      {isTranscribingMic ? (
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      ) : isRecordingMic ? (
                        <MicOff className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Mic className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="submit"
                      disabled={!input.trim() || loading}
                      className="p-1.5 text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            /* Gemini Live API Real-Time Voice Interface */
            <div className="flex-1 flex flex-col items-center justify-between p-6 bg-slate-950 text-white">
              <div className="text-center space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Gemini 3.8 Live Voice API
                </span>
                <h3 className="text-base font-bold text-slate-100 pt-2">
                  Real-Time Tactical Voice Assistant
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Speak hands-free with low-latency bidirectional audio about the active FIR case and BNS procedures.
                </p>
              </div>

              {/* Animated Voice Orb */}
              <div className="relative flex items-center justify-center my-4">
                {liveConnected && (
                  <div className="absolute w-32 h-32 rounded-full bg-blue-500/20 animate-ping" />
                )}
                <button
                  type="button"
                  onClick={liveConnected ? stopLiveSession : startLiveSession}
                  disabled={liveConnecting}
                  className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center gap-1 font-bold text-xs uppercase tracking-wider shadow-xl transition-all ${
                    liveConnected
                      ? 'bg-red-600 hover:bg-red-500 text-white ring-4 ring-red-500/30'
                      : 'bg-blue-600 hover:bg-blue-500 text-white ring-4 ring-blue-500/30'
                  }`}
                >
                  {liveConnecting ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : liveConnected ? (
                    <>
                      <MicOff className="w-7 h-7" />
                      <span className="text-[10px]">End Live</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-7 h-7" />
                      <span className="text-[10px]">Start Live</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Transcriptions & Status */}
              <div className="w-full space-y-2 bg-slate-900 border border-slate-800 rounded-lg p-3 min-h-[120px] text-xs">
                {liveError ? (
                  <p className="text-red-400 font-medium">{liveError}</p>
                ) : liveConnected ? (
                  <>
                    <div className="text-slate-400">
                      <span className="text-[10px] font-bold uppercase text-sky-400 block">Officer (You):</span>
                      <p className="text-slate-200 line-clamp-2">{liveUserTranscript || 'Listening for your voice...'}</p>
                    </div>
                    <div className="text-slate-400 pt-2 border-t border-slate-800">
                      <span className="text-[10px] font-bold uppercase text-emerald-400 block">LEIU Live Copilot:</span>
                      <p className="text-slate-200 line-clamp-3">{liveModelTranscript || 'Ready to respond...'}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 text-center py-6">
                    Click <strong>Start Live</strong> to establish a real-time voice channel.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
