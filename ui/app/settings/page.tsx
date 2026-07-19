"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import {
    Activity,
    Cpu,
    Database,
    HardDrive,
    Moon,
    RefreshCw,
    Settings2,
    ShieldCheck,
    Sun,
    Terminal
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getActiveModel, setActiveModel } from "@/lib/api"

const AVAILABLE_MODELS = [
    "google/flan-t5-small",
    "google/flan-t5-base",
    "google/flan-t5-large"
];

export default function SettingsPage() {
    const { theme, setTheme } = useTheme()
    const [topK, setTopK] = useState(3)
    const [temperature, setTemperature] = useState(0.7)
    const [activeModel, setActiveModelState] = useState("google/flan-t5-base")
    const [isSwitchingModel, setIsSwitchingModel] = useState(false)
    
    // Load from local storage & API
    useEffect(() => {
        const savedTopK = localStorage.getItem('rag_top_k')
        const savedTemp = localStorage.getItem('rag_temperature')
        if (savedTopK) setTopK(parseInt(savedTopK))
        if (savedTemp) setTemperature(parseFloat(savedTemp))

        getActiveModel().then(model => setActiveModelState(model)).catch(console.error)
    }, [])

    const handleSave = () => {
        localStorage.setItem('rag_top_k', topK.toString())
        localStorage.setItem('rag_temperature', temperature.toString())
        toast.success("Settings saved", { description: "RAG engine parameters updated successfully." })
    }

    const handleModelChange = async (newModel: string) => {
        if (newModel === activeModel) return;
        setIsSwitchingModel(true);
        toast.info("Switching Neural Engine", { description: `Loading ${newModel}...` });
        try {
            const updatedModel = await setActiveModel(newModel);
            setActiveModelState(updatedModel);
            toast.success("Model Switched", { description: `Now using ${updatedModel}.` });
        } catch (err: any) {
            toast.error("Failed to switch model", { description: err.message });
        } finally {
            setIsSwitchingModel(false);
        }
    }

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12 max-w-7xl mx-auto">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">System Core</h1>
                    <p className="text-muted-foreground text-lg">Hardware orchestration and RAG model configuration.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Intelligence Modules */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-8">
                            <div className="flex items-center justify-between border-b border-border/50 pb-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Settings2 className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">RAG Engine Configuration</h3>
                                        <p className="text-sm text-muted-foreground">Adjust retrieval and generation parameters</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold">Top-K Retrieval (Sources)</label>
                                        <span className="text-primary font-mono font-bold bg-primary/10 px-2 py-1 rounded">{topK}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="1" 
                                        max="10" 
                                        value={topK}
                                        onChange={(e) => setTopK(parseInt(e.target.value))}
                                        className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground">Number of relevant complaint narratives to retrieve from ChromaDB for each query.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-bold">LLM Temperature</label>
                                        <span className="text-primary font-mono font-bold bg-primary/10 px-2 py-1 rounded">{temperature.toFixed(1)}</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.1"
                                        value={temperature}
                                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                        className="w-full accent-primary h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground">Controls randomness in generation. Lower values are more factual, higher values are more creative.</p>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSave} className="font-bold px-8 shadow-lg shadow-primary/20">
                                        Apply Parameters
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Cpu className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Neural Engine</h3>
                                        <p className="text-xs text-muted-foreground">{activeModel}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active LLM Model</label>
                                        <select 
                                            value={activeModel}
                                            onChange={(e) => handleModelChange(e.target.value)}
                                            disabled={isSwitchingModel}
                                            className="w-full h-10 px-3 rounded-lg border border-border/50 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                                        >
                                            {AVAILABLE_MODELS.map(m => (
                                                <option key={m} value={m}>{m}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest mt-4">
                                        <span>Memory Allocation</span>
                                        <span className="text-primary">{activeModel.includes('large') ? '4.8GB' : activeModel.includes('small') ? '1.2GB' : '2.4GB'} / 8.0GB</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className={`h-full bg-primary rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)] ${activeModel.includes('large') ? 'w-[60%]' : activeModel.includes('small') ? 'w-[15%]' : 'w-[30%]'}`} />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                        <Database className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">Vector Persistence</h3>
                                        <p className="text-xs text-muted-foreground">ChromaDB Storage Layer</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 flex flex-col items-center text-center gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Records</span>
                                        <span className="text-sm font-bold">15,482</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-secondary/30 border border-border/50 flex flex-col items-center text-center gap-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span>
                                        <span className="text-sm font-bold text-green-500">Active</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>

                    {/* System Logs & Actions */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Theme Toggle Panel */}
                        <Card className="p-6 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Interface Theme</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button 
                                    variant={theme === 'light' ? 'default' : 'outline'} 
                                    onClick={() => setTheme('light')}
                                    className={`h-12 border-border/50 ${theme === 'light' ? 'shadow-lg shadow-primary/20' : ''}`}
                                >
                                    <Sun className="h-4 w-4 mr-2" /> Light
                                </Button>
                                <Button 
                                    variant={theme === 'dark' ? 'default' : 'outline'} 
                                    onClick={() => setTheme('dark')}
                                    className={`h-12 border-border/50 ${theme === 'dark' ? 'shadow-lg shadow-primary/20' : ''}`}
                                >
                                    <Moon className="h-4 w-4 mr-2" /> Dark
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-6 flex-1 flex flex-col">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Terminal className="h-5 w-5 text-primary" />
                                    <h3 className="text-lg font-bold">Node Logs</h3>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="min-h-[150px] bg-black/50 rounded-xl p-4 font-mono text-[10px] text-green-500/80 space-y-2 overflow-hidden border border-white/5">
                                <p>[18:12:04] <span className="text-white">INFO:</span> Vector collection locked</p>
                                <p>[18:12:05] <span className="text-cyan-400">DEBUG:</span> flan-t5 warmup complete</p>
                                <p>[18:14:31] <span className="text-white">INFO:</span> Server listening on 0.0.0.0:8000</p>
                                <p>[18:15:00] <span className="text-green-400">SUCCESS:</span> RAG pipeline heartbeat ok</p>
                                <p className="animate-pulse">_</p>
                            </div>

                            <div className="space-y-3 pt-4 mt-auto">
                                <Button onClick={() => toast("Cache Purged", { description: "Vector cache successfully cleared." })} className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/10">
                                    Purge Vector Cache
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
