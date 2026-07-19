"use client"

import { PageTransition } from "@/components/PageTransition"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Sliders, Brain, Sparkles, Save, RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const PERSONA_OPTIONS = [
    { id: "analyst", label: "Professional Analyst", description: "Formal, data-driven responses with regulatory terminology." },
    { id: "concise", label: "Direct & Concise", description: "Short, punchy answers that get straight to the point." },
    { id: "support", label: "Customer Support", description: "Warm, empathetic tone suitable for consumer-facing roles." },
    { id: "executive", label: "Executive Summary", description: "High-level strategic insights for leadership briefings." },
]

export default function SettingsPage() {
    const [topK, setTopK] = useState(3)
    const [persona, setPersona] = useState("analyst")
    const [hasChanges, setHasChanges] = useState(false)

    useEffect(() => {
        const savedTopK = localStorage.getItem('rag_top_k')
        const savedPersona = localStorage.getItem('rag_persona')
        if (savedTopK) setTopK(parseInt(savedTopK))
        if (savedPersona) setPersona(savedPersona)
    }, [])

    const handleSave = () => {
        localStorage.setItem('rag_top_k', topK.toString())
        localStorage.setItem('rag_persona', persona)
        setHasChanges(false)
        toast.success("Settings saved successfully!")
    }

    const handleReset = () => {
        setTopK(3)
        setPersona("analyst")
        localStorage.setItem('rag_top_k', '3')
        localStorage.setItem('rag_persona', 'analyst')
        setHasChanges(false)
        toast.info("Settings reset to defaults.")
    }

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-10 max-w-4xl mx-auto">
                <header className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-2 border border-primary/20">
                        <Settings className="h-3 w-3" />
                        Configuration
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground">RAG Engine Settings</h1>
                    <p className="text-muted-foreground text-lg">Fine-tune the retrieval and generation parameters for the AI Investigator.</p>
                </header>

                {/* Top K Retrieval */}
                <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <Sliders className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">Retrieval Depth (Top-K)</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Controls how many complaint narratives the FAISS vector store retrieves before generating a response. 
                                Higher values provide more evidence but may slow response time.
                            </p>
                        </div>
                    </div>
                    
                    <div className="space-y-4 pl-16">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-muted-foreground">Documents to retrieve</span>
                            <span className="text-2xl font-black text-primary tabular-nums">{topK}</span>
                        </div>
                        <input 
                            type="range" 
                            min={1} 
                            max={10} 
                            value={topK}
                            onChange={(e) => { setTopK(parseInt(e.target.value)); setHasChanges(true); }}
                            className="w-full h-2 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span>Focused (1)</span>
                            <span>Balanced (5)</span>
                            <span>Comprehensive (10)</span>
                        </div>
                    </div>
                </Card>

                {/* Persona */}
                <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                            <Brain className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight">AI Persona</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Customize how the AI presents its analysis. This adjusts the system prompt that guides the LLM's tone and formatting.
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-16">
                        {PERSONA_OPTIONS.map((p) => (
                            <button
                                key={p.id}
                                onClick={() => { setPersona(p.id); setHasChanges(true); }}
                                className={`p-4 rounded-2xl text-left transition-all duration-300 border ${
                                    persona === p.id 
                                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-lg shadow-primary/10' 
                                        : 'border-border/50 bg-secondary/30 hover:border-border hover:bg-secondary/50'
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {persona === p.id && <Sparkles className="h-3.5 w-3.5 text-primary" />}
                                    <span className={`text-sm font-bold ${persona === p.id ? 'text-primary' : 'text-foreground'}`}>
                                        {p.label}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">{p.description}</p>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-4">
                    <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="rounded-xl font-bold"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Defaults
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={!hasChanges}
                        className="rounded-xl font-bold shadow-lg shadow-primary/20 px-8"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Save Configuration
                    </Button>
                </div>
            </div>
        </PageTransition>
    )
}
