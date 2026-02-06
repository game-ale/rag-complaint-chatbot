'use client';

import { SourceCard } from '@/components/SourceCard';
import { Source } from '@/lib/types';

interface SourceListProps {
    sources: Source[];
}

export function SourceList({ sources }: SourceListProps) {
    if (sources.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sources ({sources.length})</h3>
            <div className="space-y-3">
                {sources.slice(0, 5).map((source, index) => (
                    <SourceCard key={index} source={source} index={index + 1} />
                ))}
            </div>
        </div>
    );
}
