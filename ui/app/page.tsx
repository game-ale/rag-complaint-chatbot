'use client';

import { AnswerPanel } from '@/components/AnswerPanel';
import { ChatInput } from '@/components/ChatInput';
import { PageTransition } from '@/components/PageTransition';
import { AnswerSkeleton } from '@/components/SkeletonLoader';
import { SourceList } from '@/components/SourceList';
import { ThemeToggle } from '@/components/theme-toggle';
import { askQuestion } from '@/lib/api';
import { RAGResponse } from '@/lib/types';
import { ArrowRight, BarChart3, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [response, setResponse] = useState<RAGResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (question: string, product?: string) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await askQuestion({
        question,
        filters: product ? { product } : undefined
      });
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while connecting to the AI engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setResponse(null);
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
        {/* Top Navigation / Actions */}
        <nav className="fixed top-0 lg:left-64 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 px-8">
          <div className="container mx-auto h-16 flex items-center justify-end">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end mr-6 border-r border-border/50 pr-6">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Protocol Status</span>
                <span className="text-xs font-bold text-green-500">Secure & Reactive</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mx-auto px-8 pt-32 pb-24 max-w-4xl relative z-10">
          {/* Enterprise Hero Section */}
          <section className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-foreground border border-border shadow-sm text-[13px] font-semibold tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Intelligence Framework v2.1
            </div>

            <h1 className="text-6xl font-black tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              Turn complaints into <span className="text-primary tracking-tighter">insights.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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

          {/* Input & Results Control Area */}
          <div className="space-y-10">
            <div className="space-y-4">
              <ChatInput
                onSubmit={handleSubmit}
                onClear={clearChat}
                isLoading={isLoading}
              />

              {!response && !isLoading && (
                <div className="flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-1000">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSubmit(s)}
                      className="px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-primary/5 hover:border-primary/30 text-xs font-bold text-muted-foreground hover:text-primary transition-all duration-300 backdrop-blur-sm"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
              <div className="animate-in fade-in duration-700">
                <AnswerSkeleton />
              </div>
            )}

            {response && !isLoading && (
              <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                {/* Active Filter Badge if selected */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Insight Layer:</span>
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    {response.sources.length} Verified Evidence Nodes
                  </div>
                </div>

                <AnswerPanel answer={response.answer} />
                <SourceList sources={response.sources} />
              </div>
            )}
          </div>

          <footer className="mt-32 pt-12 border-t border-border/50 text-center space-y-4">
            <div className="flex justify-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <BarChart3 className="h-6 w-6" />
              <ShieldCheck className="h-6 w-6" />
              <Zap className="h-6 w-6" />
            </div>
            <p className="text-[13px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
              CrediTrust Analytics Protocol v2.1
            </p>
          </footer>
        </main>
      </div>
    </PageTransition>
  )
}
