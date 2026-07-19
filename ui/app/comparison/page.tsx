"use client"

import { PageTransition } from "@/components/PageTransition"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { ArrowRightLeft, CreditCard, Scale, ShieldAlert, Zap } from "lucide-react"
import { useState } from "react"

const MOCK_COMPARISON = {
    creditCard: {
        total: 12450,
        topIssues: [
            { name: "Billing dispute", percent: 45 },
            { name: "Fraudulent charges", percent: 25 },
            { name: "Late fees", percent: 15 },
            { name: "Customer service", percent: 10 },
            { name: "Other", percent: 5 }
        ],
        companies: ["CitiBank", "Capital One", "Chase"]
    },
    personalLoan: {
        total: 8200,
        topIssues: [
            { name: "High interest rates", percent: 50 },
            { name: "Payment processing", percent: 20 },
            { name: "Predatory terms", percent: 15 },
            { name: "Customer service", percent: 10 },
            { name: "Other", percent: 5 }
        ],
        companies: ["SoFi", "Upstart", "LendingClub"]
    }
}

export default function ComparisonPage() {
    const [isComparing, setIsComparing] = useState(false)

    const handleCompare = () => {
        setIsComparing(true)
    }

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
                <header className="space-y-2 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Cross-Product Analysis</h1>
                    <p className="text-muted-foreground text-lg">Compare complaint distributions and primary friction points across different financial products.</p>
                </header>

                <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
                        <div className="w-full md:w-64 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Baseline Product</label>
                            <Select defaultValue="credit_card">
                                <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl text-base font-bold">
                                    <SelectValue placeholder="Select Product A" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                    <SelectItem value="personal_loan">Personal Loan</SelectItem>
                                    <SelectItem value="mortgage">Mortgage</SelectItem>
                                    <SelectItem value="bank_account">Bank Account</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="hidden md:flex h-12 w-12 rounded-full bg-secondary items-center justify-center text-muted-foreground shrink-0 mt-6">
                            <ArrowRightLeft className="h-5 w-5" />
                        </div>

                        <div className="w-full md:w-64 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Comparison Target</label>
                            <Select defaultValue="personal_loan">
                                <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl text-base font-bold">
                                    <SelectValue placeholder="Select Product B" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="credit_card">Credit Card</SelectItem>
                                    <SelectItem value="personal_loan">Personal Loan</SelectItem>
                                    <SelectItem value="mortgage">Mortgage</SelectItem>
                                    <SelectItem value="bank_account">Bank Account</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleCompare} className="w-full md:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 mt-6">
                            <Zap className="h-4 w-4 mr-2" />
                            Run Analysis
                        </Button>
                    </div>

                    {isComparing && (
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Product A */}
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">Credit Card</h3>
                                            <p className="text-sm text-muted-foreground font-medium">{MOCK_COMPARISON.creditCard.total.toLocaleString()} total narratives</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold tracking-tight flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4 text-destructive" />
                                        Primary Friction Points
                                    </h4>
                                    {MOCK_COMPARISON.creditCard.topIssues.map((issue, idx) => (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                                <span>{issue.name}</span>
                                                <span>{issue.percent}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{ width: `${issue.percent}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Top Entities Mentioned</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {MOCK_COMPARISON.creditCard.companies.map((company, idx) => (
                                            <span key={idx} className="px-3 py-1 rounded-lg bg-background border border-border/50 text-xs font-bold">{company}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Product B */}
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
                                            <Scale className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">Personal Loan</h3>
                                            <p className="text-sm text-muted-foreground font-medium">{MOCK_COMPARISON.personalLoan.total.toLocaleString()} total narratives</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold tracking-tight flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4 text-destructive" />
                                        Primary Friction Points
                                    </h4>
                                    {MOCK_COMPARISON.personalLoan.topIssues.map((issue, idx) => (
                                        <div key={idx} className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                                <span>{issue.name}</span>
                                                <span>{issue.percent}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${issue.percent}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Top Entities Mentioned</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {MOCK_COMPARISON.personalLoan.companies.map((company, idx) => (
                                            <span key={idx} className="px-3 py-1 rounded-lg bg-background border border-border/50 text-xs font-bold">{company}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </PageTransition>
    )
}
