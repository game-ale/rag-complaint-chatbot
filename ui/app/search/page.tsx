"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Hash, Search as SearchIcon } from "lucide-react"

export default function SearchPage() {
    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-8 max-w-4xl mx-auto">
                <header className="space-y-2 text-center">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Global Registry Search</h1>
                    <p className="text-muted-foreground text-lg">Cross-index search for narratives, entities, and products.</p>
                </header>

                <div className="relative group max-w-3xl mx-auto mt-8">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full h-16 pl-16 pr-6 bg-card/50 backdrop-blur-xl border-2 border-border/50 rounded-2xl focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-lg font-medium shadow-xl"
                        autoFocus
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-3 pt-4">
                    <Badge variant="outline" className="px-4 py-1.5 text-sm cursor-pointer hover:bg-secondary">Complaint ID</Badge>
                    <Badge variant="outline" className="px-4 py-1.5 text-sm cursor-pointer bg-primary/10 text-primary border-primary/20">Company</Badge>
                    <Badge variant="outline" className="px-4 py-1.5 text-sm cursor-pointer hover:bg-secondary">Issue</Badge>
                    <Badge variant="outline" className="px-4 py-1.5 text-sm cursor-pointer hover:bg-secondary">Product</Badge>
                </div>

                {/* Mock Search Results */}
                <div className="pt-8 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Top Matches</h3>
                    
                    {[1, 2, 3].map((item) => (
                        <Card key={item} className="p-6 border-border/50 hover:border-primary/30 transition-colors cursor-pointer group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-secondary text-foreground text-[10px]">Entity Match</Badge>
                                        <span className="text-sm font-bold text-muted-foreground"><Hash className="inline h-3 w-3 mr-0.5" />CFPB-439{item}</span>
                                    </div>
                                    <h4 className="text-lg font-bold group-hover:text-primary transition-colors">Wells Fargo Bank</h4>
                                    <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl line-clamp-2">
                                        The consumer's narrative specifically mentions issues with fraudulent charges originating from their checking account and the subsequent failure of the entity to resolve the dispute in a timely manner according to regulations.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </PageTransition>
    )
}
