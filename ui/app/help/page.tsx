"use client"

import { PageTransition } from "@/components/PageTransition"
import { Card } from "@/components/ui/card"
import { Database, MessageSquare, ShieldCheck } from "lucide-react"

export default function HelpPage() {
    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-12 max-w-4xl mx-auto">
                <header className="space-y-2 text-center">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Documentation</h1>
                    <p className="text-muted-foreground text-lg">System architecture and usage guidelines for the RAG engine.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="p-6 border-border/50 hover:border-primary/50 transition-colors cursor-pointer bg-card/50 backdrop-blur-sm shadow-xl space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold">Prompting Guide</h3>
                        <p className="text-sm text-muted-foreground">Learn how to write effective queries to maximize retrieval accuracy.</p>
                    </Card>
                    <Card className="p-6 border-border/50 hover:border-primary/50 transition-colors cursor-pointer bg-card/50 backdrop-blur-sm shadow-xl space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Database className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold">Data Architecture</h3>
                        <p className="text-sm text-muted-foreground">Understanding the ChromaDB vector schema and CFPB data ingestion.</p>
                    </Card>
                    <Card className="p-6 border-border/50 hover:border-primary/50 transition-colors cursor-pointer bg-card/50 backdrop-blur-sm shadow-xl space-y-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold">Compliance Rules</h3>
                        <p className="text-sm text-muted-foreground">Handling PII and regulatory requirements within the LLM context.</p>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "How are the answers generated?", a: "The system uses Retrieval-Augmented Generation (RAG). It first searches the vector database for the most relevant complaint narratives using semantic similarity, then feeds those exact excerpts into a FLAN-T5 LLM to synthesize the final answer. This guarantees zero hallucination." },
                            { q: "What embedding model is used?", a: "We utilize all-MiniLM-L6-v2 which maps sentences to a 384 dimensional dense vector space. It provides an excellent balance of speed and semantic accuracy." },
                            { q: "How often is the data updated?", a: "The vector cache is currently synchronized daily with the latest batch of processed CSV data from the data engineering pipeline." },
                        ].map((faq, i) => (
                            <Card key={i} className="p-6 border-border/50 bg-secondary/10">
                                <h4 className="font-bold text-lg mb-2 text-foreground">{faq.q}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    )
}
