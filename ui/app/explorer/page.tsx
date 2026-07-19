"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { searchComplaints, getComplaintStats } from "@/lib/api"
import { Complaint } from "@/lib/types"
import { ArrowUpDown, ChevronLeft, ChevronRight, Download, Search, Loader2, Eye, X } from "lucide-react"
import { useEffect, useState } from "react"

export default function ExplorerPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [productFilter, setProductFilter] = useState("")
    const [complaints, setComplaints] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [total, setTotal] = useState(0)
    const [products, setProducts] = useState<string[]>([])
    const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null)

    useEffect(() => {
        fetchComplaints(1)
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const stats = await getComplaintStats()
            if (stats.byProduct) {
                setProducts(stats.byProduct.map((p: any) => p.name))
            }
        } catch (err) {
            console.error("Failed to get products")
        }
    }

    const fetchComplaints = async (p: number) => {
        setIsLoading(true)
        try {
            const data = await searchComplaints(searchQuery || "", productFilter || undefined, p)
            setComplaints(data.data || [])
            setPage(data.page || 1)
            setTotalPages(data.pages || 0)
            setTotal(data.total || 0)
        } catch (error) {
            console.error("Failed to fetch complaints", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchComplaints(1)
    }

    const handleExport = () => {
        if (complaints.length === 0) return
        const headers = ["ID", "Product", "Issue", "Company", "State", "Date"]
        const csvContent = [
            headers.join(","),
            ...complaints.map(row =>
                [row.id, `"${row.product}"`, `"${row.issue}"`, `"${row.company}"`, row.state, row.date].join(",")
            )
        ].join("\n")
        
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `creditrust_export_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Complaint Explorer</h1>
                        <p className="text-muted-foreground text-lg">Browse and filter raw consumer narratives and metadata.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={handleExport} className="rounded-full h-10 px-8 shadow-lg shadow-primary/20">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </header>

                <Card className="p-6 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6">
                    {/* Filters Row */}
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search narratives, companies, or IDs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-12 pr-4 bg-secondary/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                        
                        <select
                            value={productFilter}
                            onChange={(e) => setProductFilter(e.target.value)}
                            className="h-10 bg-secondary/50 border border-border/50 rounded-xl px-4 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                        >
                            <option value="">All Products</option>
                            {products.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>

                        <Button type="submit" variant="outline" className="h-10 rounded-xl border-border/50">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                    </form>

                    {/* Data Table */}
                    <div className="overflow-x-auto rounded-xl border border-border/50 relative min-h-[300px]">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}
                        <table className="w-full text-left border-collapse bg-card/50">
                            <thead>
                                <tr className="border-b border-border/50 bg-secondary/30">
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">ID</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-foreground">Product <ArrowUpDown className="h-3 w-3" /></div>
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Issue</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Company</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">State</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        <div className="flex items-center gap-2 cursor-pointer hover:text-foreground">Date <ArrowUpDown className="h-3 w-3" /></div>
                                    </th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {complaints.map((item, idx) => (
                                    <tr key={idx} className="group hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedComplaint(item)}>
                                        <td className="px-6 py-4 font-mono text-sm font-bold text-foreground">{item.id}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 max-w-[150px] truncate block">{item.product}</Badge>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm text-foreground/80 max-w-[200px] truncate">{item.issue}</td>
                                        <td className="px-6 py-4 font-bold text-sm max-w-[150px] truncate">{item.company}</td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium text-sm">{item.state}</td>
                                        <td className="px-6 py-4 text-muted-foreground font-medium text-sm whitespace-nowrap">{item.date}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="icon" className="group-hover:translate-x-1 transition-transform h-8 w-8">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                        <span className="font-medium">{total.toLocaleString()} total records</span>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled={page <= 1} onClick={() => fetchComplaints(page - 1)}>
                                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                            </Button>
                            <span className="font-bold text-foreground px-2">Page {page} / {totalPages || 1}</span>
                            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled={page >= totalPages} onClick={() => fetchComplaints(page + 1)}>
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Detail Modal */}
                {selectedComplaint && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedComplaint(null)}>
                        <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 border-border/50 shadow-2xl space-y-4" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-black">{selectedComplaint.id}</h2>
                                    <Badge variant="outline" className="mt-2 bg-primary/5 text-primary border-primary/20">{selectedComplaint.product}</Badge>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setSelectedComplaint(null)}>
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-border/50">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Company</span>
                                    <p className="text-sm font-bold mt-1">{selectedComplaint.company}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">State</span>
                                    <p className="text-sm font-bold mt-1">{selectedComplaint.state}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date</span>
                                    <p className="text-sm font-bold mt-1">{selectedComplaint.date}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Issue</span>
                                    <p className="text-sm font-bold mt-1">{selectedComplaint.issue}</p>
                                </div>
                            </div>
                            {selectedComplaint.narrative && (
                                <div className="pt-4 border-t border-border/50">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Consumer Narrative</span>
                                    <p className="text-sm text-foreground/80 leading-relaxed mt-2 whitespace-pre-wrap">{selectedComplaint.narrative}</p>
                                </div>
                            )}
                        </Card>
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
