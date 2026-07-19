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
import { getRecentComplaints } from "@/lib/api"
import { Download, FileText, FileType2, Presentation, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ReportsPage() {
    const [format, setFormat] = useState<"pdf" | "csv" | "pptx">("pdf")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleDownload = async () => {
        setIsGenerating(true)
        
        try {
            if (format === "csv") {
                const data = await getRecentComplaints(100) // Get more for CSV export
                
                // Convert to CSV
                const headers = ["ID", "Product", "Issue", "Company", "State", "Date"]
                const csvContent = [
                    headers.join(","),
                    ...data.map(row => 
                        [row.id, `"${row.product}"`, `"${row.issue}"`, `"${row.company}"`, row.state, row.date].join(",")
                    )
                ].join("\n")
                
                // Trigger download
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.setAttribute("href", url)
                link.setAttribute("download", `creditrust_report_${new Date().toISOString().split('T')[0]}.csv`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                
                toast.success("CSV Export Complete", { description: `Successfully exported ${data.length} records.` })
            } else if (format === "pdf") {
                toast("Generating PDF", { description: "Preparing document for print layout..." })
                setTimeout(() => {
                    window.print()
                }, 1000)
            } else {
                toast.info("PPTX Export", { description: "PowerPoint export requires the Enterprise backend module." })
            }
        } catch (error) {
            toast.error("Export Failed", { description: "An error occurred while generating the report." })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12 max-w-4xl mx-auto">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Generate Reports</h1>
                    <p className="text-muted-foreground text-lg">Export structured complaint analysis data for external stakeholders.</p>
                </header>

                <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Target Product</label>
                                <Select defaultValue="credit">
                                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl text-base font-bold">
                                        <SelectValue placeholder="Select Product" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Products</SelectItem>
                                        <SelectItem value="credit">Credit Card</SelectItem>
                                        <SelectItem value="loan">Personal Loan</SelectItem>
                                        <SelectItem value="mortgage">Mortgage</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Time Horizon</label>
                                <Select defaultValue="month">
                                    <SelectTrigger className="h-12 bg-secondary/50 border-border/50 rounded-xl text-base font-bold">
                                        <SelectValue placeholder="Select Time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="week">Last 7 Days</SelectItem>
                                        <SelectItem value="month">Last 30 Days</SelectItem>
                                        <SelectItem value="quarter">Last Quarter</SelectItem>
                                        <SelectItem value="year">Last Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Export Format</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <button 
                                    onClick={() => setFormat("pdf")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 gap-2 transition-all ${format === 'pdf' ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 bg-secondary/20 hover:border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground'}`}
                                >
                                    <FileText className="h-6 w-6" />
                                    <span className="text-xs font-bold">PDF</span>
                                </button>
                                <button 
                                    onClick={() => setFormat("csv")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 gap-2 transition-all ${format === 'csv' ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 bg-secondary/20 hover:border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground'}`}
                                >
                                    <FileType2 className="h-6 w-6" />
                                    <span className="text-xs font-bold">CSV</span>
                                </button>
                                <button 
                                    onClick={() => setFormat("pptx")}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 gap-2 transition-all ${format === 'pptx' ? 'border-primary bg-primary/5 text-primary' : 'border-border/50 bg-secondary/20 hover:border-border hover:bg-secondary/40 text-muted-foreground hover:text-foreground'}`}
                                >
                                    <Presentation className="h-6 w-6" />
                                    <span className="text-xs font-bold">PPTX</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border/50 flex justify-end">
                        <Button 
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="h-12 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 min-w-[200px]"
                        >
                            {isGenerating ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4 mr-2" />
                            )}
                            {isGenerating ? "Generating..." : "Generate & Download"}
                        </Button>
                    </div>
                </Card>
            </div>
        </PageTransition>
    )
}
