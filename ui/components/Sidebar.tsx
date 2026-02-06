"use client"

import { cn } from "@/lib/utils"
import {
    BarChart3,
    History,
    LayoutDashboard,
    Settings,
    ShieldCheck,
    Zap
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
    {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
        description: "AI Intelligence Engine"
    },
    {
        name: "Analytics",
        href: "/analytics",
        icon: BarChart3,
        description: "Market Friction Trends"
    },
    {
        name: "Case Archive",
        href: "/history",
        icon: History,
        description: "Historical Analysis"
    },
    {
        name: "System Core",
        href: "/settings",
        icon: Settings,
        description: "Config & Logs"
    }
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl hidden lg:flex flex-col z-50">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                        <Zap className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">CrediTrust</h1>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">Analytics Engine</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 py-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                    : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                                isActive ? "text-primary-foreground" : "text-muted-foreground"
                            )} />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{item.name}</span>
                                {!isActive && (
                                    <span className="text-[10px] opacity-0 group-hover:opacity-60 transition-opacity font-medium">
                                        {item.description}
                                    </span>
                                )}
                            </div>
                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-white rounded-full -ml-1" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 mt-auto">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 space-y-3">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold uppercase tracking-widest">Enterprise Mode</span>
                    </div>
                    <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-primary rounded-full" />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">
                        System performance: Optimal
                    </p>
                </div>
            </div>
        </aside>
    )
}
