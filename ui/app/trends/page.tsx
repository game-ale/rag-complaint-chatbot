"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getTrendsData } from "@/lib/api"
import { ArrowDownRight, ArrowUpRight, Loader2, Minus, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export default function TrendsPage() {
    const [trends, setTrends] = useState<any[]>([])
    const [timeline, setTimeline] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getTrendsData()
                setTrends(data.trending || [])
                setTimeline(data.timeline || [])
            } catch (err) {
                console.error("Failed to load trends:", err)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    // Derive spotlight cards from top 3 trends
    const getSpotlight = () => {
        if (trends.length < 1) return []
        return trends.slice(0, 3).map(t => ({
            issue: t.issue,
            direction: t.direction,
            change: t.change,
            count: t.count,
        }))
    }

    const spotlight = getSpotlight()

    const spotlightConfig = [
        { label: "Critical Spike", color: "destructive", bgColor: "bg-destructive/5 border-destructive/20", textColor: "text-destructive", icon: ArrowUpRight },
        { label: "Watchlist", color: "amber", bgColor: "bg-amber-500/5 border-amber-500/20", textColor: "text-amber-500", icon: TrendingUp },
        { label: "Monitor", color: "green", bgColor: "bg-green-500/5 border-green-500/20", textColor: "text-green-500", icon: ArrowDownRight },
    ]

    if (isLoading) {
        return (
            <PageTransition>
                <div className="p-8 lg:p-12 flex items-center justify-center min-h-[60vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12 max-w-5xl mx-auto">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Emerging Trends</h1>
                    <p className="text-muted-foreground text-lg">Data-driven shifts in complaint volume across product categories.</p>
                </header>

                {/* Spotlight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {spotlight.map((item, idx) => {
                        const config = spotlightConfig[idx] || spotlightConfig[2]
                        const Icon = config.icon
                        return (
                            <Card key={idx} className={`p-6 border-border/50 ${config.bgColor} shadow-xl space-y-4`}>
                                <div className={`flex items-center gap-2 ${config.textColor} font-bold text-sm uppercase tracking-widest`}>
                                    <Icon className="h-5 w-5" />
                                    {config.label}
                                </div>
                                <h3 className="text-2xl font-black line-clamp-1">{item.issue}</h3>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {item.direction === "up" ? "Up" : item.direction === "down" ? "Down" : "Stable"} {item.change} complaints MoM · {item.count.toLocaleString()} total
                                </p>
                            </Card>
                        )
                    })}
                </div>

                {/* Volume Timeline */}
                {timeline.length > 0 && (
                    <Card className="p-6 border-border/50 shadow-xl bg-card/30 backdrop-blur-sm space-y-4">
                        <h3 className="text-lg font-bold">Complaint Volume Timeline</h3>
                        <div className="flex items-end gap-2 h-40">
                            {timeline.map((item, idx) => {
                                const maxCount = Math.max(...timeline.map(t => t.count))
                                const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                                        <span className="text-[10px] font-bold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                            {item.count.toLocaleString()}
                                        </span>
                                        <div 
                                            className="w-full bg-primary/80 rounded-t-lg transition-all duration-500 hover:bg-primary min-h-[4px]"
                                            style={{ height: `${Math.max(height, 4)}%` }}
                                        />
                                        <span className="text-[9px] font-bold text-muted-foreground mt-1 truncate w-full text-center">
                                            {item.date.split(' ')[0]}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </Card>
                )}

                {/* Trend Matrix Table */}
                <Card className="overflow-hidden border-border/50 shadow-xl bg-card/30 backdrop-blur-sm">
                    <div className="p-6 border-b border-border/50 bg-secondary/20">
                        <h3 className="text-lg font-bold">Volume Shift Matrix</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Issue Vector</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Direction</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">MoM Change</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {trends.length === 0 ? (
                                    <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No trend data available yet.</td></tr>
                                ) : (
                                    trends.map((trend, idx) => (
                                        <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-5 font-bold text-sm text-foreground">{trend.issue}</td>
                                            <td className="px-6 py-5">
                                                <Badge variant="outline" className={`text-xs ${
                                                    trend.direction === 'up' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                                    trend.direction === 'down' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                    'bg-secondary text-muted-foreground'
                                                }`}>
                                                    {trend.direction === 'up' && <ArrowUpRight className="h-3 w-3 mr-1" />}
                                                    {trend.direction === 'down' && <ArrowDownRight className="h-3 w-3 mr-1" />}
                                                    {trend.direction === 'stable' && <Minus className="h-3 w-3 mr-1" />}
                                                    {trend.direction}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`text-sm font-black ${
                                                    trend.direction === 'up' ? 'text-destructive' :
                                                    trend.direction === 'down' ? 'text-green-500' : 'text-muted-foreground'
                                                }`}>
                                                    {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}{trend.change}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 font-mono text-sm">{trend.count.toLocaleString()}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </PageTransition>
    )
}
