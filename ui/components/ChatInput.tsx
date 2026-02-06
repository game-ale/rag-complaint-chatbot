'use client';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Eraser, Lightbulb, Search, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ChatInputProps {
    onSubmit: (question: string, product?: string) => void;
    onClear: () => void;
    isLoading: boolean;
}

const PRODUCTS = [
    "Credit card",
    "Debt collection",
    "Mortgages",
    "Bank account",
    "Credit reporting"
];

const EXAMPLES = [
    "Why are customers unhappy with credit cards?",
    "What issues increased last month for money transfers?",
    "Compare mortgage complaints across top companies.",
    "Common debt collection friction points."
];

export function ChatInput({ onSubmit, onClear, isLoading }: ChatInputProps) {
    const [question, setQuestion] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<string>('all');
    const [exampleIndex, setExampleIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setExampleIndex((prev) => (prev + 1) % EXAMPLES.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmit = () => {
        if (question.trim()) {
            onSubmit(question, selectedProduct === 'all' ? undefined : selectedProduct);
            setQuestion('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="space-y-6 bg-card p-6 rounded-2xl border border-border shadow-sm ring-1 ring-border/5">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                    <Search className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Research Query</span>
                </div>

                <div className="relative group">
                    <Textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={EXAMPLES[exampleIndex]}
                        className="min-h-[120px] resize-none focus-visible:ring-primary text-base bg-secondary/30 border-border/50 transition-all duration-300"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex items-center gap-2 text-muted-foreground animate-in fade-in duration-1000">
                    <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs">Try: "{EXAMPLES[exampleIndex]}"</span>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-1">Scope Filter</span>
                    <Select
                        value={selectedProduct}
                        onValueChange={setSelectedProduct}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-[200px] h-10 bg-secondary/50 border-border/50">
                            <SelectValue placeholder="All Products" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Products (Global)</SelectItem>
                            {PRODUCTS.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-3 self-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setQuestion('');
                            onClear();
                        }}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Eraser className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !question.trim()}
                        className="h-10 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 font-bold"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Zap className="h-4 w-4 animate-pulse fill-current" />
                                Analyzing...
                            </span>
                        ) : (
                            'Initiate Analysis'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
