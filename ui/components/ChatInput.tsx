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
import { Eraser } from 'lucide-react';
import { useState } from 'react';

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

export function ChatInput({ onSubmit, onClear, isLoading }: ChatInputProps) {
    const [question, setQuestion] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<string>('all');

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
        <div className="space-y-4 bg-card p-4 rounded-xl border shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask a question about customer complaints..."
                        className="min-h-[100px] resize-none focus-visible:ring-primary"
                        disabled={isLoading}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Filter by Product:</span>
                    <Select
                        value={selectedProduct}
                        onValueChange={setSelectedProduct}
                        disabled={isLoading}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Product" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Products</SelectItem>
                            {PRODUCTS.map(p => (
                                <SelectItem key={p} value={p}>{p}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onClear}
                        disabled={isLoading}
                        title="Clear Chat"
                    >
                        <Eraser className="h-4 w-4" />
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !question.trim()}
                        className="min-w-[100px]"
                    >
                        {isLoading ? 'Processing...' : 'Ask Question'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
