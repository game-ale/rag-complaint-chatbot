"use client"

import { PageTransition } from "@/components/PageTransition"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { compareProducts, getComplaintStats } from "@/lib/api"
import { ArrowRightLeft, CreditCard, Scale, ShieldAlert, Zap, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function ComparisonPage() {
    const [products, setProducts] = useState<string[]>([])
    const [productA, setProductA] = useState("")
    const [productB, setProductB] = useState("")
    
    const [isComparing, setIsComparing] = useState(false)
    const [comparisonData, setComparisonData] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const stats = await getComplaintStats()
                if (stats.byProduct) {
                    const prodNames = stats.byProduct.map((p: any) => p.name)
                    setProducts(prodNames)
                    if (prodNames.length > 0) setProductA(prodNames[0])
                    if (prodNames.length > 1) setProductB(prodNames[1])
                }
            } catch (err) {
                console.error("Failed to load products for comparison", err)
            }
        }
        fetchProducts()
    }, [])

    const handleCompare = async () => {
        if (!productA || !productB) return
        setIsLoading(true)
        setIsComparing(true)
        try {
            const data = await compareProducts(productA, productB)
            setComparisonData(data)
        } catch (err) {
            console.error("Failed to compare products", err)
        } finally {
            setIsLoading(false)
        }
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
                            <select
                                value={productA}
                                onChange={(e) => setProductA(e.target.value)}
                                className="w-full h-12 bg-secondary/50 border border-border/50 rounded-xl text-base font-bold px-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {products.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        <div className="hidden md:flex h-12 w-12 rounded-full bg-secondary items-center justify-center text-muted-foreground shrink-0 mt-6">
                            <ArrowRightLeft className="h-5 w-5" />
                        </div>

                        <div className="w-full md:w-64 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Comparison Target</label>
                            <select
                                value={productB}
                                onChange={(e) => setProductB(e.target.value)}
                                className="w-full h-12 bg-secondary/50 border border-border/50 rounded-xl text-base font-bold px-4 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                {products.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>

                        <Button 
                            onClick={handleCompare} 
                            disabled={isLoading || !productA || !productB}
                            className="w-full md:w-auto h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 mt-6"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Zap className="h-4 w-4 mr-2" />}
                            {isLoading ? "Analyzing..." : "Run Analysis"}
                        </Button>
                    </div>

                    {isComparing && comparisonData && (
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Product A */}
                            <div className="space-y-6">
                                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">{productA}</h3>
                                            <p className="text-sm text-muted-foreground font-medium">{comparisonData.productA.total.toLocaleString()} total complaints</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold tracking-tight flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4 text-destructive" />
                                        Primary Friction Points
                                    </h4>
                                    {comparisonData.productA.topIssues.map((issue: any, idx: number) => {
                                        const percent = Math.round((issue.count / comparisonData.productA.total) * 100) || 0
                                        return (
                                            <div key={idx} className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                                    <span>{issue.issue}</span>
                                                    <span>{percent}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${percent}%` }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Top Entities Mentioned</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {comparisonData.productA.topCompanies.map((company: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1 rounded-lg bg-background border border-border/50 text-xs font-bold">{company.company}</span>
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
                                            <h3 className="text-xl font-black">{productB}</h3>
                                            <p className="text-sm text-muted-foreground font-medium">{comparisonData.productB.total.toLocaleString()} total complaints</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold tracking-tight flex items-center gap-2">
                                        <ShieldAlert className="h-4 w-4 text-destructive" />
                                        Primary Friction Points
                                    </h4>
                                    {comparisonData.productB.topIssues.map((issue: any, idx: number) => {
                                        const percent = Math.round((issue.count / comparisonData.productB.total) * 100) || 0
                                        return (
                                            <div key={idx} className="space-y-1.5">
                                                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                                                    <span>{issue.issue}</span>
                                                    <span>{percent}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                    <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${percent}%` }} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="p-5 rounded-2xl bg-secondary/30 border border-border/50">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Top Entities Mentioned</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {comparisonData.productB.topCompanies.map((company: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1 rounded-lg bg-background border border-border/50 text-xs font-bold">{company.company}</span>
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
