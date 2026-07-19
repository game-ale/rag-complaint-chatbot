'use client';

import { AnswerPanel } from '@/components/AnswerPanel';
import { ChatInput } from '@/components/ChatInput';
import { PageTransition } from '@/components/PageTransition';
import { AnswerSkeleton } from '@/components/SkeletonLoader';
import { SourceList } from '@/components/SourceList';
import { askQuestion } from '@/lib/api';
import { ChatMessage } from '@/lib/types';
import { ArrowRight, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useAuth } from '@/lib/authContext';
import { API_URL } from '@/lib/api';

export default function ChatPage() {
  const { token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    } else {
      localStorage.removeItem('chatHistory');
    }
  }, [messages]);

  // Scroll to bottom when loading or new message
  useEffect(() => {
    if (isLoading || messages.length > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [messages, isLoading]);

  const handleSubmit = async (question: string, product?: string) => {
    setIsLoading(true);
    setError(null);

    const tempId = Date.now().toString();
    
    // Add empty message for streaming
    setMessages(prev => [...prev, {
      id: tempId,
      question,
      answer: "",
      sources: [],
      product,
      timestamp: Date.now(),
      responseTime: 0,
      isStreaming: true
    }]);

    try {
      const wsUrl = API_URL.replace('http', 'ws') + '/ws/ask';
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setIsLoading(false); // Stop main loading spinner, start streaming
        ws.send(JSON.stringify({
          token: token,
          question: question,
          filters: product ? { product } : undefined
        }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'token') {
          setMessages(prev => prev.map(msg => {
            if (msg.id === tempId) {
              return { ...msg, answer: msg.answer + data.content };
            }
            return msg;
          }));
        } else if (data.type === 'sources') {
          setMessages(prev => prev.map(msg => {
            if (msg.id === tempId) {
              return { ...msg, sources: data.content };
            }
            return msg;
          }));
        } else if (data.type === 'done') {
          setMessages(prev => prev.map(msg => {
            if (msg.id === tempId) {
              return { ...msg, isStreaming: false, responseTime: data.response_time };
            }
            return msg;
          }));
          ws.close();
        } else if (data.type === 'error') {
          setError(data.message);
          ws.close();
        }
      };

      ws.onerror = (error) => {
        setError("WebSocket connection error. Please try again.");
        setIsLoading(false);
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
      };
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while connecting to the AI engine.');
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const suggestions = [
    "Florida credit card fraud trends?",
    "Citibank mortgage complaints",
    "Debt collection harassment issues",
    "Bank account fee transparency"
  ];

  return (
    <PageTransition>
      <div className="min-h-screen">
        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-8 pt-12 pb-24 max-w-4xl relative z-10">
          
          {messages.length === 0 && !isLoading && (
            <section className="text-center mb-16 space-y-6 pt-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-foreground border border-border shadow-sm text-[13px] font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-700">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Intelligence Framework v2.1
              </div>

              <h1 className="text-5xl sm:text-6xl font-black tracking-tight text-foreground lg:text-7xl">
                Turn complaints into <span className="text-primary tracking-tighter">insights.</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Harness grounded RAG intelligence to analyze customer friction.
                Instant, factual analysis backed by real-world evidence narratives.
              </p>

              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Zero Hallucination
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  Evidence Grounded
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <ArrowRight className="h-4 w-4 text-primary" />
                  Traceable Sources
                </div>
              </div>
            </section>
          )}

          <div className="space-y-12">
            {/* Conversation Thread */}
            {messages.length > 0 && (
              <div className="space-y-16">
                {messages.map((msg, idx) => (
                  <div key={msg.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl rounded-tr-sm max-w-[85%] shadow-md">
                        <p className="font-medium text-[15px]">{msg.question}</p>
                        {msg.product && (
                          <div className="mt-2 text-[10px] uppercase tracking-widest font-bold opacity-70">
                            Filtered: {msg.product}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Answer & Sources */}
                    <div className="space-y-8">
                      <AnswerPanel 
                        answer={msg.answer} 
                        responseTime={msg.responseTime || 0} 
                        sourceCount={msg.sources.length}
                        isStreaming={msg.isStreaming}
                        onFeedback={(type) => {
                            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, feedback: type } : m));
                        }}
                        currentFeedback={msg.feedback}
                      />
                      <SourceList sources={msg.sources} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="p-5 bg-destructive/5 border border-destructive/20 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <ShieldCheck className="h-4 w-4 rotate-180" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-destructive">Engine Communication Failure</h4>
                    <p className="text-destructive/80 text-xs mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="animate-in fade-in duration-700 pt-8">
                <AnswerSkeleton />
              </div>
            )}

            <div ref={bottomRef} className="h-4" />

            {/* Input Area Sticky at Bottom */}
            <div className="sticky bottom-6 z-20 pt-4">
              <div className="space-y-4">
                <ChatInput
                  onSubmit={handleSubmit}
                  onClear={clearChat}
                  isLoading={isLoading}
                />

                {messages.length === 0 && !isLoading && (
                  <div className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-1000 hidden sm:flex">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSubmit(s)}
                        className="px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-primary/5 hover:border-primary/30 text-xs font-bold text-muted-foreground hover:text-primary transition-all duration-300 backdrop-blur-md"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  )
}
