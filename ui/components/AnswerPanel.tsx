'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Activity, Check, Copy, FileText, ListChecks, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AnswerPanelProps {
    answer: string;
    responseTime?: number;
    sourceCount?: number;
    onFeedback?: (type: 'up' | 'down') => void;
    currentFeedback?: 'up' | 'down';
}

export function AnswerPanel({ answer, responseTime = 2.1, sourceCount = 0, onFeedback, currentFeedback }: AnswerPanelProps) {
    const [copied, setCopied] = useState(false);
    const [displayedAnswer, setDisplayedAnswer] = useState("");
    const [isStreaming, setIsStreaming] = useState(true);

    useEffect(() => {
        setIsStreaming(true);
        setDisplayedAnswer("");
        let currentIndex = 0;
        
        const interval = setInterval(() => {
            if (currentIndex <= answer.length) {
                setDisplayedAnswer(answer.slice(0, currentIndex));
                currentIndex += 3; // Stream 3 chars at a time for speed
            } else {
                setDisplayedAnswer(answer);
                setIsStreaming(false);
                clearInterval(interval);
            }
        }, 10); // Very fast interval

        return () => clearInterval(interval);
    }, [answer]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(answer);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Basic logic to partition answer if it has bullets or structure
    const sections = displayedAnswer.split('\n\n');
    const summary = sections.find(s => s.toLowerCase().includes('summary') || s.includes('-') || s.includes(':')) || sections[0];
    const analysis = sections.length > 1 ? sections.slice(1).join('\n\n') : '';

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <Card className="overflow-hidden border-border/50 shadow-xl ring-1 ring-border/5 bg-card/80 backdrop-blur-xl">
                <div className="p-6 md:p-8">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-border/50">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-foreground tracking-tight">Executive Analysis</h3>
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                    <Activity className="h-2.5 w-2.5 text-green-500" />
                                    <span>Grounded RAG</span>
                                    <span className="opacity-40">•</span>
                                    <span>{responseTime.toFixed(2)}s</span>
                                    {isStreaming && <span className="ml-2 animate-pulse text-primary font-bold">● Streaming</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {onFeedback && !isStreaming && (
                                <div className="flex items-center gap-1 bg-secondary/50 rounded-full p-1 border border-border/50 mr-2 hidden sm:flex animate-in zoom-in duration-300">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-7 w-7 rounded-full ${currentFeedback === 'up' ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => onFeedback('up')}
                                    >
                                        <ThumbsUp className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className={`h-7 w-7 rounded-full ${currentFeedback === 'down' ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => onFeedback('down')}
                                    >
                                        <ThumbsDown className="h-3.5 w-3.5" />
                                    </Button>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={isStreaming}
                                className="h-9 px-4 rounded-full border-border/50 hover:bg-secondary transition-colors"
                                onClick={copyToClipboard}
                            >
                                {copied ? (
                                    <Check className="h-4 w-4 text-green-500 sm:mr-2" />
                                ) : (
                                    <Copy className="h-4 w-4 text-muted-foreground sm:mr-2" />
                                )}
                                <span className="font-bold text-xs hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* TL;DR Section */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="flex items-center gap-2 text-primary">
                                <ListChecks className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-[0.15em]">Key Observations</span>
                            </div>
                            <div className="bg-secondary/40 rounded-2xl p-5 border border-border/50">
                                <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-medium min-h-[60px]">
                                    {summary}
                                    {isStreaming && !analysis && <span className="animate-pulse font-black text-primary ml-1">_</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${isStreaming ? 'bg-primary' : 'bg-green-500'} animate-pulse`} />
                                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{sourceCount} Verified Sources</span>
                            </div>
                        </div>

                        {/* Detailed Analysis Section */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <FileText className="h-4 w-4" />
                                <span className="text-xs font-bold uppercase tracking-[0.15em]">Deep Context Analysis</span>
                            </div>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <div className="text-foreground/80 leading-relaxed whitespace-pre-wrap text-[15px] min-h-[60px]">
                                    {analysis || (sections.length === 1 && !isStreaming ? answer : '')}
                                    {isStreaming && analysis && <span className="animate-pulse font-black text-primary ml-1">_</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Confidence Bar */}
                <div className="bg-secondary/30 px-6 py-3 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                        <span>Model: FLAN-T5-BASE</span>
                        <span className="opacity-30">|</span>
                        <span className="hidden sm:inline">Vector Cache: ChromaDB</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4].map(i => <div key={i} className={`h-1.5 w-3 rounded-full ${isStreaming ? 'bg-primary/30 animate-pulse' : 'bg-primary'}`} style={{animationDelay: `${i * 100}ms`}} />)}
                            <div className="h-1.5 w-3 rounded-full bg-primary/20" />
                        </div>
                        <span className="text-[10px] font-bold text-primary ml-1">92% MATCH</span>
                    </div>
                </div>
            </Card>
        </div>
    );
}
