'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Source } from '@/lib/types';
import { Building2, ChevronDown, ChevronUp, Hash, Quote } from 'lucide-react';
import { useState } from 'react';

interface SourceCardProps {
    source: Source;
    index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="p-0 border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all duration-300">
            <div className="bg-card p-4 rounded-xl border">
                <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                                #{index}
                            </div>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-2 py-0">
                                {source.product}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">{source.company}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Hash className="h-3.5 w-3.5" />
                                <span>{source.complaint_id}</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-2 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>

                {isExpanded && (
                    <div className="mt-4 pt-4 border-t animate-in slide-in-from-top-2 duration-300">
                        <div className="flex gap-3">
                            <Quote className="h-5 w-5 text-primary/20 shrink-0" />
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                {source.text}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
