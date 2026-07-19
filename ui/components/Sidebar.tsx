"use client"

import { cn } from "@/lib/utils"
import {
    BarChart3,
    FileText,
    FolderSearch,
    HelpCircle,
    LayoutDashboard,
    Menu,
    MessageSquare,
    Moon,
    Scale,
    Search,
    Settings,
    ShieldCheck,
    Sun,
    TrendingUp,
    User,
    X,
    Zap,
    Bell
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "./ui/button"

const menuGroups = [
    {
        title: "MAIN",
        items: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "AI Chat", href: "/chat", icon: MessageSquare },
            { name: "Analytics", href: "/analytics", icon: BarChart3 },
        ]
    },
    {
        title: "EXPLORE",
        items: [
            { name: "Complaint Explorer", href: "/explorer", icon: FolderSearch },
            { name: "Trends", href: "/trends", icon: TrendingUp },
            { name: "Compliance", href: "/compliance", icon: Scale },
        ]
    },
    {
        title: "TOOLS",
        items: [
            { name: "Reports", href: "/reports", icon: FileText },
            { name: "Search", href: "/search", icon: Search },
        ]
    },
    {
        title: "SYSTEM",
        items: [
            { name: "Profile", href: "/profile", icon: User },
            { name: "Settings", href: "/settings", icon: Settings },
            { name: "Help", href: "/help", icon: HelpCircle },
        ]
    }
]

import { useAuth } from "@/lib/authContext"

export function Sidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const { theme, setTheme } = useTheme()

    // Don't show sidebar on login page
    if (pathname === '/login' || pathname === '/') return null;

    const SidebarContent = () => (
        <>
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

            <nav className="flex-1 px-4 space-y-6 py-4 overflow-y-auto no-scrollbar pb-24 lg:pb-4">
                {menuGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                        <div className="px-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                            {group.title}
                        </div>
                        {group.items.map((item) => {
                            const isActive = pathname === item.href || (pathname === '/' && item.href === '/dashboard')
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 relative",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                            : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <item.icon className={cn(
                                        "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                                    )} />
                                    <span className="text-sm font-bold">{item.name}</span>
                                    {isActive && (
                                        <div className="absolute left-0 w-1 h-5 bg-white rounded-full -ml-1" />
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-4 mt-auto border-t border-border/50 bg-card/50 space-y-3">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Theme</span>
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="h-8 w-14 rounded-full bg-secondary border border-border/50 relative transition-all duration-500 hover:border-primary/30"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <div className={cn(
                            "absolute top-0.5 h-7 w-7 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm",
                            theme === 'dark'
                                ? "left-[calc(100%-30px)] bg-primary text-primary-foreground"
                                : "left-0.5 bg-white text-yellow-500 border border-border/50"
                        )}>
                            {theme === 'dark' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                        </div>
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center font-bold text-sm text-foreground uppercase">
                            {user?.name?.[0] || "U"}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold leading-none">{user?.name || "User"}</span>
                            <span className="text-[10px] font-medium text-muted-foreground mt-1 capitalize">{user?.role || "User"}</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={logout} title="Logout" className="relative text-muted-foreground hover:text-foreground hover:bg-secondary">
                        <User className="h-5 w-5 text-destructive" />
                    </Button>
                </div>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border/50 z-50 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                        <Zap className="h-4 w-4 fill-current" />
                    </div>
                    <span className="font-bold tracking-tight">CrediTrust</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="relative text-muted-foreground">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-background"></span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {isOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 border-r border-border/50 bg-card/95 backdrop-blur-xl flex-col z-50 transition-transform duration-300 lg:translate-x-0 flex",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <SidebarContent />
            </aside>
        </>
    )
}
