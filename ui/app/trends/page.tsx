"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, Minus, TrendingUp } from "lucide-react"

const TRENDS = [
    { issue: "Billing dispute", category: "Credit Card", change: "+42%", direction: "up", volume: 1240 },
    { issue: "Fraudulent charges", category: "Money Transfer", change: "+28%", direction: "up", volume: 890 },
    { issue: "Loan modification delay", category: "Mortgages", change: "-15%", direction: "down", volume: 450 },
    { issue: "Account access", category: "Bank Account", change: "+5%", direction: "stable", volume: 2100 },
    { issue: "Predatory interest", category: "Personal Loan", change: "+18%", direction: "up", volume: 670 }
]

export default function TrendsPage() {
    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12 max-w-5xl mx-auto">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Emerging Trends</h1>
                    <p className="text-muted-foreground text-lg">AI-detected shifts in complaint volume across all product categories.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border-border/50 bg-destructive/5 border-destructive/20 shadow-xl space-y-4">
                        <div className="flex items-center gap-2 text-destructive font-bold text-sm uppercase tracking-widest">
                            <ArrowUpRight className="h-5 w-5" />
                            Critical Spike
                        </div>
                        <h3 className="text-3xl font-black">Billing Disputes</h3>
                        <p className="text-sm font-medium text-muted-foreground">Up 42% in the last 7 days across Credit Cards.</p>
                    </Card>
                    <Card className="p-6 border-border/50 bg-amber-500/5 border-amber-500/20 shadow-xl space-y-4">
                        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm uppercase tracking-widest">
                            <TrendingUp className="h-5 w-5" />
                            Watchlist
                        </div>
                        <h3 className="text-3xl font-black">Transfer Fraud</h3>
                        <p className="text-sm font-medium text-muted-foreground">Up 28% in the last 14 days for Money Transfers.</p>
                    </Card>
                    <Card className="p-6 border-border/50 bg-green-500/5 border-green-500/20 shadow-xl space-y-4">
                        <div className="flex items-center gap-2 text-green-500 font-bold text-sm uppercase tracking-widest">
                            <ArrowDownRight className="h-5 w-5" />
                            Improving
                        </div>
                        <h3 className="text-3xl font-black">Loan Mods</h3>
                        <p className="text-sm font-medium text-muted-foreground">Down 15% following recent policy changes.</p>
                    </Card>
                </div>

                <Card className="overflow-hidden border-border/50 shadow-xl bg-card/30 backdrop-blur-sm">
                    <div className="p-6 border-b border-border/50 bg-secondary/20">
                        <h3 className="text-lg font-bold">Volume Shift Matrix</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border/50">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Issue Vector</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">7D Change</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">7D Volume</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {TRENDS.map((trend, idx) => (
                                    <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                                        <td className="px-6 py-5 font-bold text-sm text-foreground">{trend.issue}</td>
                                        <td className="px-6 py-5">
                                            <Badge variant="outline" className="text-xs">{trend.category}</Badge>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`flex items-center gap-1.5 text-sm font-black ${
                                                trend.direction === 'up' ? 'text-destructive' :
                                                trend.direction === 'down' ? 'text-green-500' : 'text-muted-foreground'
                                            }`}>
                                                {trend.direction === 'up' && <ArrowUpRight className="h-4 w-4" />}
                                                {trend.direction === 'down' && <ArrowDownRight className="h-4 w-4" />}
                                                {trend.direction === 'stable' && <Minus className="h-4 w-4" />}
                                                {trend.change}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 font-mono text-sm">{trend.volume}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </PageTransition>
    )
}
