'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Source } from '@/lib/types';
import { AlertCircle, Building2, Calendar, ChevronDown, ChevronUp, Hash, Quote } from 'lucide-react';
import { useState } from 'react';

interface SourceCardProps {
    source: Source;
    index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card className="p-0 border-none shadow-sm group hover:ring-1 hover:ring-primary/20 transition-all duration-300">
            <div className="bg-card p-5 rounded-2xl border border-border/50 group-hover:border-primary/20 transition-colors">
                <div className="flex items-start justify-between">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                                0{index + 1}
                            </div>
                            <Badge variant="secondary" className="bg-primary/5 text-primary hover:bg-primary/10 border-primary/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md">
                                {source.product}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 pt-1">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Company</span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                                    {source.company}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Case Reference</span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                                    {source.complaint_id}
                                </div>
                            </div>

                            <div className="flex flex-row sm:flex-col gap-2 sm:gap-1 items-center sm:items-start">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Archived Testimony</span>
                                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    Grounded Evidence
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="ml-4 h-10 w-10 rounded-full hover:bg-secondary transition-colors"
                    >
                        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </Button>
                </div>

                {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-border/50 animate-in slide-in-from-top-4 duration-500">
                        <div className="flex gap-4">
                            <div className="mt-1 hidden sm:block">
                                <Quote className="h-8 w-8 text-primary/10 shrink-0" />
                            </div>
                            <div className="space-y-3">
                                <p className="text-[15px] text-foreground/80 leading-relaxed italic font-medium">
                                    "{source.text}"
                                </p>
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        <Calendar className="h-3 w-3" />
                                        Verification Context Ready
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
