import { Skeleton } from "@/components/ui/skeleton"

export function AnswerSkeleton() {
    return (
        <div className="space-y-6">
            <div className="p-6 border rounded-xl space-y-4">
                <Skeleton className="h-6 w-[200px]" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[95%]" />
                    <Skeleton className="h-4 w-[90%]" />
                    <Skeleton className="h-4 w-[85%]" />
                </div>
            </div>

            <div className="space-y-4">
                <Skeleton className="h-6 w-[150px]" />
                <div className="grid gap-4">
                    <Skeleton className="h-[120px] w-full" />
                    <Skeleton className="h-[120px] w-full" />
                </div>
            </div>
        </div>
    )
}
