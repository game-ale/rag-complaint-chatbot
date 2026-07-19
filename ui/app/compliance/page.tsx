"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { getComplaintStats, searchComplaints } from "@/lib/api"
import { AlertTriangle, CheckCircle2, Clock, Loader2, ShieldAlert, ShieldCheck } from "lucide-react"
import { useEffect, useState } from "react"

// Map product categories to regulatory framework
const REGULATORY_FRAMEWORKS = [
    { name: "TILA (Truth in Lending)", products: ["Credit card", "Payday loan", "Consumer Loan"], threshold: 85 },
    { name: "FDCPA (Debt Collection)", products: ["Debt collection"], threshold: 80 },
    { name: "FCRA (Credit Reporting)", products: ["Credit reporting, credit repair services, or other personal consumer reports", "Credit reporting"], threshold: 85 },
    { name: "ECOA (Equal Credit)", products: ["Mortgage", "Student loan"], threshold: 75 },
]

export default function CompliancePage() {
    const [stats, setStats] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getComplaintStats()
                setStats(data)
            } catch (err) {
                console.error("Failed to load stats:", err)
            } finally {
                setIsLoading(false)
            }
        }
        load()
    }, [])

    // Compute compliance metrics from real data
    const totalComplaints = stats?.narrativeStats?.total || 0
    const withNarrative = stats?.narrativeStats?.withNarrative || 0
    const narrativeRate = totalComplaints > 0 ? Math.round((withNarrative / totalComplaints) * 100) : 0
    
    // Overall health = percentage of resolved complaints (simulate from stats)
    const topCompanies = stats?.topCompanies || []
    const topIssues = stats?.topIssues || []

    // Derive regulatory scores from product distribution
    const getRegScore = (framework: typeof REGULATORY_FRAMEWORKS[0]) => {
        if (!stats?.byProduct) return framework.threshold
        const relevant = stats.byProduct.filter((p: any) => 
            framework.products.some(fp => p.name.toLowerCase().includes(fp.toLowerCase()))
        )
        const totalRelevant = relevant.reduce((acc: number, p: any) => acc + p.value, 0)
        // Score inversely proportional to volume - higher volume = lower compliance score
        const score = Math.max(50, 100 - Math.round((totalRelevant / Math.max(totalComplaints, 1)) * 100))
        return Math.min(99, score)
    }

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
            <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Regulatory Compliance</h1>
                    <p className="text-muted-foreground text-lg">Monitor SLA metrics, high-risk narratives, and CFPB reporting health.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck className="h-16 w-16 text-green-500" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Narrative Coverage</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-green-500">{narrativeRate}%</span>
                            <span className="text-sm font-bold text-muted-foreground mb-1">Coverage Rate</span>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground">{withNarrative.toLocaleString()} / {totalComplaints.toLocaleString()} have narratives</p>
                    </Card>

                    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Clock className="h-16 w-16 text-amber-500" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Avg Narrative Length</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-amber-500">{stats?.narrativeStats?.avgLength || 0}</span>
                            <span className="text-sm font-bold text-muted-foreground mb-1">Characters</span>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground mt-2">Longer = more detailed complaints</p>
                    </Card>

                    <Card className="p-6 border-border/50 bg-destructive/5 border-destructive/20 shadow-xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle className="h-16 w-16 text-destructive" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-destructive">Top Issue Volume</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-destructive">{topIssues[0]?.count?.toLocaleString() || 0}</span>
                            <span className="text-sm font-bold text-muted-foreground mb-1">Cases</span>
                        </div>
                        <p className="text-xs font-bold text-destructive/80 mt-2">{topIssues[0]?.issue || "N/A"}</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-destructive" />
                                Top Issue Escalations
                            </h3>
                        </div>
                        
                        <Card className="overflow-hidden border-border/50 shadow-xl bg-card/30 backdrop-blur-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border/50 bg-secondary/30">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Issue Type</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Volume</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Severity</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {topIssues.map((issue: any, idx: number) => {
                                            const severity = issue.count > 5000 ? 'critical' : issue.count > 2000 ? 'high' : 'medium'
                                            return (
                                                <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-sm text-foreground">{issue.issue}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-mono text-sm font-bold">{issue.count.toLocaleString()}</td>
                                                    <td className="px-6 py-4">
                                                        <Badge variant="outline" className={
                                                            severity === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                                            severity === 'high' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                                            'bg-green-500/10 text-green-500 border-green-500/20'
                                                        }>
                                                            {severity}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold tracking-tight">Regulatory Matrix</h3>
                        <Card className="p-6 border-border/50 shadow-xl bg-card/30 backdrop-blur-sm space-y-6">
                            {REGULATORY_FRAMEWORKS.map((framework, idx) => {
                                const score = getRegScore(framework)
                                const status = score >= 90 ? 'pass' : score >= 70 ? 'warning' : 'alert'
                                return (
                                    <div key={idx} className="space-y-3">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span>{framework.name}</span>
                                            <span className={`flex items-center gap-1 ${
                                                status === 'pass' ? 'text-green-500' :
                                                status === 'warning' ? 'text-amber-500' : 'text-destructive'
                                            }`}>
                                                {status === 'pass' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                                {status === 'pass' ? 'Pass' : status === 'warning' ? 'Warning' : 'Alert'}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${
                                                    status === 'pass' ? 'bg-green-500' :
                                                    status === 'warning' ? 'bg-amber-500' : 'bg-destructive'
                                                }`}
                                                style={{ width: `${score}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
