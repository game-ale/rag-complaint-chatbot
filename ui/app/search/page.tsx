"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { searchComplaints } from "@/lib/api"
import { Hash, Search as SearchIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function SearchPage() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState<any[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const handleSearch = async (searchPage: number = 1) => {
        if (!query.trim()) return
        setIsLoading(true)
        try {
            const data = await searchComplaints(query, undefined, searchPage)
            setResults(data.data || [])
            setTotal(data.total || 0)
            setPage(data.page || 1)
            setPages(data.pages || 0)
            setHasSearched(true)
        } catch (err) {
            console.error("Search failed:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-8 max-w-4xl mx-auto">
                <header className="space-y-2 text-center">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Global Registry Search</h1>
                    <p className="text-muted-foreground text-lg">Cross-index search for narratives, entities, and products.</p>
                </header>

                <form onSubmit={(e) => { e.preventDefault(); handleSearch(1); }} className="relative group max-w-3xl mx-auto mt-8">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search complaints by company, ID, or narrative..."
                        className="w-full h-16 pl-16 pr-6 bg-card/50 backdrop-blur-xl border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium shadow-xl"
                        autoFocus
                    />
                </form>

                {isLoading && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {hasSearched && !isLoading && (
                    <div className="pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                                {total.toLocaleString()} Results Found
                            </h3>
                            {pages > 1 && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Button 
                                        variant="ghost" size="sm" 
                                        disabled={page <= 1}
                                        onClick={() => handleSearch(page - 1)}
                                        className="h-8"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                                    </Button>
                                    <span className="font-bold">Page {page} / {pages}</span>
                                    <Button 
                                        variant="ghost" size="sm"
                                        disabled={page >= pages}
                                        onClick={() => handleSearch(page + 1)}
                                        className="h-8"
                                    >
                                        Next <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <Card className="p-12 text-center border-border/50 bg-card/30 backdrop-blur-sm">
                                <p className="text-muted-foreground font-medium">No complaints match your query.</p>
                            </Card>
                        ) : (
                            results.map((item, idx) => (
                                <Card key={idx} className="p-6 border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold">{item.product}</Badge>
                                            <span className="text-sm font-bold text-muted-foreground"><Hash className="inline h-3 w-3 mr-0.5" />{item.id}</span>
                                            <span className="text-xs text-muted-foreground ml-auto">{item.date}</span>
                                        </div>
                                        <h4 className="text-base font-bold group-hover:text-primary transition-colors">{item.company}</h4>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.issue}</p>
                                        {item.narrative && (
                                            <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl line-clamp-2 pt-1 border-t border-border/30 mt-2">
                                                {item.narrative}
                                            </p>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                )}
            </div>
        </PageTransition>
    )
}
