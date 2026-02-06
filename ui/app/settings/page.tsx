"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
    Activity,
    Cpu,
    Database,
    HardDrive,
    RefreshCw,
    ShieldCheck,
    Terminal
} from "lucide-react"

export default function SettingsPage() {
    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">System Core</h1>
                    <p className="text-muted-foreground text-lg">Hardware orchestration and RAG model configuration.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Intelligence Modules */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Cpu className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">Neural Engine</h3>
                                        <p className="text-sm text-muted-foreground">Local LLM Orchestration</p>
                                    </div>
                                </div>
                                <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5 font-bold">ACTIVE</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Model Weight</span>
                                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 font-mono text-sm">
                                        google/flan-t5-base
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Quantization</span>
                                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50 font-mono text-sm">
                                        Float32 (Full Precision)
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                                    <span>Memory Allocation</span>
                                    <span className="text-primary">2.4GB / 8.0GB</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full w-[30%] bg-primary rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Database className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Vector Persistence</h3>
                                    <p className="text-sm text-muted-foreground">ChromaDB Storage Layer</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { label: "Collection", value: "complaints_v1", icon: HardDrive },
                                    { label: "Indexing", value: "HNSW", icon: Activity },
                                    { label: "Records", value: "15,482", icon: ShieldCheck }
                                ].map((stat, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-secondary/30 border border-border/50 flex flex-col items-center text-center gap-1">
                                        <stat.icon className="h-4 w-4 text-muted-foreground mb-1" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{stat.label}</span>
                                        <span className="text-sm font-bold">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* System Logs & Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card className="p-6 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6 h-full flex flex-col">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-bold">Node Logs</h3>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex-1 bg-black/50 rounded-xl p-4 font-mono text-[10px] text-green-500/80 space-y-2 overflow-hidden border border-white/5">
                                <p>[18:12:04] <span className="text-white">INFO:</span> Vector collection locked</p>
                                <p>[18:12:05] <span className="text-cyan-400">DEBUG:</span> flan-t5 warmup complete</p>
                                <p>[18:14:31] <span className="text-white">INFO:</span> Server listening on 0.0.0.0:8000</p>
                                <p>[18:15:00] <span className="text-green-400">SUCCESS:</span> RAG pipeline heartbeat ok</p>
                                <p className="animate-pulse">_</p>
                            </div>

                            <div className="space-y-3 pt-4">
                                <Button className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/10">
                                    Purge Vector Cache
                                </Button>
                                <Button variant="outline" className="w-full rounded-xl h-12 font-bold border-border/50">
                                    Export System Diagnostics
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
