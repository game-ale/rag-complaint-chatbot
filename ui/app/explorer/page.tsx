"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { getRecentComplaints } from "@/lib/api"
import { Complaint } from "@/lib/types"
import { ArrowUpDown, ChevronRight, Download, Filter, Search, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export default function ExplorerPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [complaints, setComplaints] = useState<Complaint[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getRecentComplaints(20);
                setComplaints(data);
            } catch (error) {
                console.error("Failed to fetch complaints", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [])

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-8 max-w-[1600px] mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black tracking-tight text-foreground">Complaint Explorer</h1>
                        <p className="text-muted-foreground text-lg">Browse and filter raw consumer narratives and metadata.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button className="rounded-full h-10 px-8 shadow-lg shadow-primary/20">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </header>

                <Card className="p-6 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6">
                    {/* Filters Row */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search narratives or IDs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-10 pl-12 pr-4 bg-secondary/50 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                        
                        <Select defaultValue="all">
                            <SelectTrigger className="h-10 bg-secondary/50 border-border/50 rounded-xl">
                                <SelectValue placeholder="Product Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                <SelectItem value="credit">Credit Card</SelectItem>
                                <SelectItem value="loan">Personal Loan</SelectItem>
                                <SelectItem value="mortgage">Mortgages</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select defaultValue="all">
                            <SelectTrigger className="h-10 bg-secondary/50 border-border/50 rounded-xl">
                                <SelectValue placeholder="Company" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Companies</SelectItem>
                                <SelectItem value="citi">CitiBank</SelectItem>
                                <SelectItem value="chase">Chase</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button variant="outline" className="h-10 rounded-xl border-border/50">
                            <Filter className="h-4 w-4 mr-2" />
                            More Filters
                        </Button>
                    </div>

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
                                {complaints.map((item) => (
                                    <tr key={item.id} className="group hover:bg-secondary/20 transition-colors cursor-pointer">
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
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                        <span>Showing {complaints.length} records</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 rounded-lg" disabled>Previous</Button>
                            <Button variant="outline" size="sm" className="h-8 rounded-lg">Next</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </PageTransition>
    )
}
