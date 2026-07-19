"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Zap, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/authContext"
import { API_URL } from "@/lib/api"

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string
        const password = formData.get("password") as string

        try {
            // OAuth2 expects x-www-form-urlencoded with username and password
            const urlEncoded = new URLSearchParams()
            urlEncoded.append("username", email)
            urlEncoded.append("password", password)

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: urlEncoded
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.detail || "Invalid credentials")
            }

            const data = await response.json()
            login(data.access_token, data.user)
            // Router push is handled inside login()
        } catch (err: any) {
            setError(err.message || "An error occurred during login")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />

            <Card className="w-full max-w-md p-8 relative z-10 border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl ring-1 ring-border/50">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 mb-4">
                        <Zap className="h-6 w-6 fill-current" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-center">CrediTrust Financial</h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Intelligent Complaint Analysis</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                        <input 
                            name="email"
                            type="email" 
                            defaultValue="admin@creditrust.com"
                            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                            <span className="text-[10px] font-bold text-primary cursor-pointer hover:underline">Forgot Password?</span>
                        </div>
                        <div className="relative">
                            <input 
                                name="password"
                                type={showPassword ? "text" : "password"} 
                                defaultValue="admin123"
                                className="w-full h-12 pl-4 pr-12 rounded-xl border border-border/50 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="remember" className="rounded text-primary focus:ring-primary/50" defaultChecked />
                        <label htmlFor="remember" className="text-xs font-semibold text-muted-foreground cursor-pointer">Remember my credentials</label>
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-bold flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 rounded-xl shadow-lg shadow-primary/20 mt-6 font-bold text-sm"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                                Authenticating...
                            </span>
                        ) : (
                            "Secure Login"
                        )}
                    </Button>
                    
                    <div className="text-center mt-6 text-xs text-muted-foreground font-medium">
                        Don't have an account?{" "}
                        <span onClick={() => router.push('/register')} className="text-primary font-bold hover:underline cursor-pointer">
                            Register Here
                        </span>
                    </div>
                </form>
            </Card>
        </div>
    )
}
