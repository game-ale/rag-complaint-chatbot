"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldCheck, User } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn")
        router.push("/login")
    }

    return (
        <PageTransition>
            <div className="p-8 lg:p-12 space-y-8 max-w-3xl mx-auto">
                <header className="space-y-2">
                    <h1 className="text-4xl font-black tracking-tight text-foreground">Operator Profile</h1>
                    <p className="text-muted-foreground text-lg">Manage your credentials and view system activity.</p>
                </header>

                <Card className="p-8 border-border/50 bg-card/30 backdrop-blur-sm shadow-xl">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-32 w-32 rounded-full bg-secondary border-4 border-background shadow-xl flex items-center justify-center text-4xl font-black text-muted-foreground">
                                A
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3">
                                <ShieldCheck className="h-3 w-3 mr-1" /> Verified
                            </Badge>
                        </div>
                        
                        <div className="flex-1 space-y-6 text-center md:text-left">
                            <div>
                                <h2 className="text-3xl font-black">Asha</h2>
                                <p className="text-lg text-muted-foreground font-medium">Product Manager</p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</span>
                                    <p className="text-sm font-bold">asha@creditrust.com</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Department</span>
                                    <p className="text-sm font-bold">Credit Cards / Analysis</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last Login</span>
                                    <p className="text-sm font-bold">Today, 08:42 AM</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Queries</span>
                                    <p className="text-sm font-bold text-primary">1,248</p>
                                </div>
                            </div>
                            
                            <div className="pt-8 flex gap-4 justify-center md:justify-start">
                                <Button variant="outline" className="rounded-xl border-border/50 font-bold">
                                    Edit Profile
                                </Button>
                                <Button variant="destructive" className="rounded-xl font-bold shadow-lg shadow-destructive/20" onClick={handleLogout}>
                                    Terminate Session
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </PageTransition>
    )
}
