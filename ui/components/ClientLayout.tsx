"use client"

import { Sidebar } from "@/components/Sidebar"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isFullPage = pathname === '/login' || pathname === '/'

    return (
        <div className="flex min-h-screen bg-background">
            {!isFullPage && <Sidebar />}
            <div className={cn(
                "flex-1 relative flex flex-col min-w-0 transition-all duration-300",
                !isFullPage && "lg:pl-64 pt-16 lg:pt-0"
            )}>
                {children}
            </div>
        </div>
    )
}
