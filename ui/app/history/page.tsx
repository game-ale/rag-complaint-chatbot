"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUpDown, ChevronRight, Clock, Filter, Hash, Search, Shield, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { getHistory, deleteHistory } from "@/lib/api"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function HistoryPage() {
    const [history, setHistory] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        setIsLoading(true)
        try {
            const data = await getHistory(100)
            setHistory(data)
        } catch (err) {
            toast.error("Failed to load history")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm("Delete this history record?")) {
            try {
                await deleteHistory(id)
                setHistory(prev => prev.filter(h => h.id !== id))
                toast.success("Record deleted")
            } catch (err) {
                toast.error("Failed to delete record")
            }
        }
    }

    const filteredHistory = history.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.id.toString().includes(searchTerm)
    )

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Case Archive</h1>
                        <p className="text-muted-foreground text-lg">Historical audit trail of AI analysis sessions.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" className="rounded-full border-border/50 h-10 px-6">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Button className="rounded-full h-10 px-8 shadow-lg shadow-primary/20">
                            Export CSV
                        </Button>
                    </div>
                </header>

                {/* Audit Search */}
                <div className="relative group max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search archival cases by ID or query keyword..."
                        className="w-full h-12 pl-12 pr-4 bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* History Table */}
                <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-md shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border/50 bg-secondary/30">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                                            Case ID <ArrowUpDown className="h-3 w-3" />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analysis Query</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Protocol Status</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Source Count</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Execution Date</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Loading history...</td></tr>
                                ) : filteredHistory.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No records found.</td></tr>
                                ) : (
                                    filteredHistory.map((item) => (
                                        <tr key={item.id} className="group hover:bg-secondary/20 transition-colors cursor-pointer">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                        <Hash className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="text-sm font-black text-foreground">TR-{item.id}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 max-w-md">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-foreground line-clamp-1">{item.question}</span>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary opacity-70">{item.product_filter || 'All Products'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex justify-center">
                                                    <Badge className={cn(
                                                        "rounded-full px-3 py-0.5 border-none font-bold text-[10px] uppercase tracking-widest",
                                                        (item.sources?.length || 0) > 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                    )}>
                                                        <Shield className="h-2.5 w-2.5 mr-1.5 fill-current" />
                                                        {(item.sources?.length || 0) > 0 ? "Grounded" : "Refused"}
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className="text-sm font-black text-foreground/70">{item.sources?.length || 0}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span className="text-xs font-semibold">{new Date(item.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={(e) => handleDelete(item.id, e)} className="text-muted-foreground hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform">
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 bg-secondary/10 border-t border-border/50 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">Showing {filteredHistory.length} of {history.length} records</span>
                    </div>
                </Card>
            </div>
        </PageTransition>
    )
}
