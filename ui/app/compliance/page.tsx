"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, ShieldCheck } from "lucide-react"

const COMPLIANCE_ALERTS = [
    { id: "CFPB-4392", issue: "Failure to investigate dispute", severity: "high", days: 12, product: "Credit Card" },
    { id: "CFPB-4389", issue: "Aggressive collection tactics", severity: "high", days: 8, product: "Debt Collection" },
    { id: "CFPB-4388", issue: "Unauthorized account opening", severity: "critical", days: 3, product: "Bank Account" },
    { id: "CFPB-4381", issue: "Discriminatory lending terms", severity: "critical", days: 1, product: "Mortgage" },
]

export default function CompliancePage() {
    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Regulatory Compliance</h1>
                    <p className="text-muted-foreground text-lg">Monitor SLA breaches, high-risk narratives, and CFPB reporting deadlines.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck className="h-16 w-16 text-green-500" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Overall Health</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-green-500">94%</span>
                            <span className="text-sm font-bold text-muted-foreground mb-1">Pass Rate</span>
                        </div>
                    </Card>

                    <Card className="p-6 border-border/50 bg-card/50 backdrop-blur-sm shadow-xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Clock className="h-16 w-16 text-amber-500" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Avg Resolution Time</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-amber-500">12.4</span>
                            <span className="text-sm font-bold text-muted-foreground mb-1">Days</span>
                        </div>
                        <p className="text-xs font-bold text-muted-foreground mt-2">Target: &lt; 15 Days</p>
                    </Card>

                    <Card className="p-6 border-border/50 bg-destructive/5 border-destructive/20 shadow-xl space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <AlertTriangle className="h-16 w-16 text-destructive" />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-destructive">SLA Breaches (15+ Days)</h3>
                        <div className="flex items-end gap-3">
                            <span className="text-5xl font-black text-destructive">24</span>
                            <span className="text-sm font-bold text-muted-foreground mb-1">Active Cases</span>
                        </div>
                        <p className="text-xs font-bold text-destructive/80 mt-2">+5 from last week</p>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                                <ShieldAlert className="h-5 w-5 text-destructive" />
                                High-Risk Escalations
                            </h3>
                        </div>
                        
                        <Card className="overflow-hidden border-border/50 shadow-xl bg-card/30 backdrop-blur-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-border/50 bg-secondary/30">
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Case ID</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Issue Type</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Severity</th>
                                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Age</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/30">
                                        {COMPLIANCE_ALERTS.map((alert, idx) => (
                                            <tr key={idx} className="hover:bg-secondary/20 transition-colors">
                                                <td className="px-6 py-4 font-mono text-sm font-bold">{alert.id}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-sm text-foreground">{alert.issue}</div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">{alert.product}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="outline" className={
                                                        alert.severity === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }>
                                                        {alert.severity}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-sm font-bold ${alert.days > 10 ? 'text-destructive' : 'text-foreground'}`}>
                                                        {alert.days} days
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold tracking-tight">Regulatory Matrix</h3>
                        <Card className="p-6 border-border/50 shadow-xl bg-card/30 backdrop-blur-sm space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span>TILA (Truth in Lending)</span>
                                    <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Pass</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[95%]" />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span>FDCPA (Debt Collection)</span>
                                    <span className="text-amber-500 flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Warning</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[78%]" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span>FCRA (Credit Reporting)</span>
                                    <span className="text-green-500 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Pass</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[88%]" />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm font-bold">
                                    <span>ECOA (Equal Credit)</span>
                                    <span className="text-destructive flex items-center gap-1"><AlertTriangle className="h-4 w-4" /> Alert</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-destructive w-[60%]" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
