"use client"

import { PageTransition } from "@/components/PageTransition"
import { Card } from "@/components/ui/card"
import { getComplaintStats } from "@/lib/api"
import { AnalyticsData } from "@/lib/types"
import { Activity, Clock, FileText, Layers, Loader2, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const RECENT_ACTIVITY = [
    { title: "Credit Card analysis", type: "Query", time: "2 hours ago" },
    { title: "Loan complaint report", type: "Export", time: "5 hours ago" },
    { title: "Fraud investigation", type: "Query", time: "Yesterday" }
]

export default function Dashboard() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const stats = await getComplaintStats();
                setData(stats);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [])

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
                <header className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2 border border-primary/20">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        System Online
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Welcome back, Asha 👋</h1>
                    <p className="text-muted-foreground text-lg">Here is the executive overview of today's intelligence data.</p>
                </header>

                {/* KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading || !data ? (
                        [...Array(4)].map((_, i) => (
                            <Card key={i} className="p-6 border-border/50 bg-card/30 backdrop-blur-sm h-32 flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </Card>
                        ))
                    ) : (
                        [
                            { label: "Total Complaints", value: data.narrativeStats.total.toLocaleString(), icon: FileText, trend: "Updated today" },
                            { label: "Tracked Products", value: data.byProduct.length.toString(), icon: Layers, trend: "All systems active" },
                            { label: "Today's Queries", value: "24", icon: Activity, trend: "+12% vs yesterday" },
                            { label: "Avg Response", value: "2.1s", icon: Zap, trend: "Optimal speed" }
                        ].map((kpi, i) => (
                            <Card key={i} className="p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-border/50 bg-card/30 backdrop-blur-sm">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <kpi.icon className="h-12 w-12 text-primary" />
                                </div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{kpi.label}</p>
                                <h3 className="text-3xl font-black text-foreground">{kpi.value}</h3>
                                <div className="mt-2 flex items-center gap-1.5">
                                    <span className="text-[10px] text-muted-foreground font-medium">{kpi.trend}</span>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Quick Actions */}
                    <div className="lg:col-span-8 space-y-6">
                        <h3 className="text-xl font-bold tracking-tight">Intelligence Hub</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/chat" className="group p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-500 block h-full">
                                <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                                    <Zap className="h-6 w-6 fill-current" />
                                </div>
                                <h4 className="text-2xl font-black mb-2">AI Investigator</h4>
                                <p className="text-sm text-muted-foreground font-medium">Ask questions directly to the RAG engine about any product or complaint trend.</p>
                            </Link>

                            <Link href="/analytics" className="group p-8 rounded-3xl bg-secondary/50 border border-border/50 hover:border-border transition-all duration-500 block h-full">
                                <div className="h-12 w-12 rounded-2xl bg-background border border-border/50 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <TrendingUp className="h-6 w-6 text-foreground" />
                                </div>
                                <h4 className="text-2xl font-black mb-2">Market Analytics</h4>
                                <p className="text-sm text-muted-foreground font-medium">View macro trends, complaint volumes, and issue distributions across all sectors.</p>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold tracking-tight">Recent Activity</h3>
                            <Link href="/history" className="text-xs font-bold text-primary hover:underline">View All</Link>
                        </div>
                        <Card className="p-6 border-border/50 bg-card/30 backdrop-blur-sm h-full max-h-[300px]">
                            <div className="space-y-6">
                                {RECENT_ACTIVITY.map((activity, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i !== RECENT_ACTIVITY.length - 1 && (
                                            <div className="absolute left-[15px] top-8 bottom-[-24px] w-px bg-border/50" />
                                        )}
                                        <div className="relative z-10 flex-shrink-0 mt-1">
                                            <div className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-muted-foreground">
                                                {activity.type === "Query" ? <Zap className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground">{activity.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{activity.type}</span>
                                                <span className="text-muted-foreground text-[10px]">•</span>
                                                <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {activity.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
