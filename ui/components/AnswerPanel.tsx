'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

interface AnswerPanelProps {
    answer: string;
}

export function AnswerPanel({ answer }: AnswerPanelProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(answer);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Card className="p-6 relative overflow-hidden ring-1 ring-primary/5 shadow-md">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    AI Analysis
                </h3>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={copyToClipboard}
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                        <Copy className="h-4 w-4 mr-1" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                </Button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {answer}
                </p>
            </div>
        </Card>
    );
}
