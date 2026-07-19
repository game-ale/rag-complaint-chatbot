'use client';

import { Button } from '@/components/ui/button';
import { Check, Copy, Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AnswerPanelProps {
    answer: string;
    responseTime?: number;
    sourceCount?: number;
    onFeedback?: (type: 'up' | 'down') => void;
    currentFeedback?: 'up' | 'down';
    isStreaming?: boolean;
}

export function AnswerPanel({ answer, responseTime = 2.1, sourceCount = 0, onFeedback, currentFeedback, isStreaming = false }: AnswerPanelProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(answer);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Basic logic to partition answer if it has bullets or structure
    const sections = answer.split('\n\n');
    const summary = sections.find(s => s.toLowerCase().includes('summary') || s.includes('-') || s.includes(':')) || sections[0];
    const analysis = sections.length > 1 ? sections.slice(1).join('\n\n') : '';

    return (
        <div className="flex gap-4 w-full animate-in fade-in duration-500 px-4 sm:px-0">
            {/* AI Avatar */}
            <div className="flex-shrink-0 mt-1 hidden sm:block">
                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-sm">
                    <Sparkles className="h-4 w-4" />
                </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 space-y-2 overflow-hidden min-w-0 max-w-3xl">
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/90 leading-relaxed font-medium prose-headings:mt-0 prose-headings:mb-3 prose-p:leading-relaxed prose-a:text-primary prose-strong:text-foreground prose-strong:font-bold prose-pre:bg-secondary/50 prose-pre:border prose-pre:border-border/50 prose-li:my-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {answer || (isStreaming ? "Synthesizing information..." : "")}
                    </ReactMarkdown>
                    {isStreaming && <span className="animate-pulse font-black text-primary ml-1 inline-block w-2 h-4 bg-primary align-middle rounded-sm"></span>}
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-1 pt-2 -ml-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg"
                        onClick={copyToClipboard}
                    >
                        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    
                    {onFeedback && !isStreaming && (
                        <>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`h-8 w-8 rounded-lg hover:bg-secondary/50 ${currentFeedback === 'up' ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground hover:text-foreground'}`}
                                onClick={() => onFeedback('up')}
                            >
                                <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className={`h-8 w-8 rounded-lg hover:bg-secondary/50 ${currentFeedback === 'down' ? 'text-red-500 bg-red-500/10' : 'text-muted-foreground hover:text-foreground'}`}
                                onClick={() => onFeedback('down')}
                            >
                                <ThumbsDown className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    
                    {/* Meta info (like source count) */}
                    {sourceCount > 0 && !isStreaming && (
                        <div className="flex items-center gap-1.5 ml-2 text-xs font-medium text-muted-foreground bg-secondary/30 px-2 py-1 rounded-md border border-border/30">
                            <Check className="h-3 w-3 text-green-500" />
                            <span>{sourceCount} sources</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
