'use client';

import { AnswerPanel } from '@/components/AnswerPanel';
import { ChatInput } from '@/components/ChatInput';
import { AnswerSkeleton } from '@/components/SkeletonLoader';
import { SourceList } from '@/components/SourceList';
import { askQuestion } from '@/lib/api';
import { RAGResponse } from '@/lib/types';
import { BarChart3, ShieldCheck, Sparkles } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black">
      {/* Header Decoration */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />

      <main className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3" />
            AI-Powered RAG System
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            CrediTrust Analysis
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Grounded intelligence for financial customer complaints.
            Providing high-fidelity answers backed by real source narratives.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Grounded</p>
              <p className="text-xs text-muted-foreground">Zero halluciation guardrails</p>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Traceable</p>
              <p className="text-xs text-muted-foreground">Citations for every answer</p>
            </div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Production</p>
              <p className="text-xs text-muted-foreground">Next.js + LLM Backend</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <ChatInput
            onSubmit={handleSubmit}
            onClear={clearChat}
            isLoading={isLoading}
          />

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl animate-in fade-in slide-in-from-top-2">
              <p className="text-destructive font-medium text-sm">Error: {error}</p>
            </div>
          )}

          {isLoading && (
            <div className="animate-in fade-in duration-500">
              <AnswerSkeleton />
            </div>
          )}

          {response && !isLoading && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <AnswerPanel answer={response.answer} />
              <SourceList sources={response.sources} />
            </div>
          )}
        </div>

        <footer className="mt-20 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2026 CrediTrust Analytics Engine. Built with Next.js, FastAPI, and ChromaDB.</p>
        </footer>
      </main>
    </div>
  );
}
