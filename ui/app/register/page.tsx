"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldCheck, Zap, Eye, EyeOff, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/authContext"
import { API_URL } from "@/lib/api"
import { toast } from "sonner"

export default function RegisterPage() {
    const router = useRouter()
    const { login } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const email = formData.get("email") as string
        const password = formData.get("password") as string
        const confirm_password = formData.get("confirm_password") as string

        if (password !== confirm_password) {
            setError("Passwords do not match.")
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.")
            setIsLoading(false)
            return
        }

        try {
            // 1. Register User
            const regResponse = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, name })
            })

            if (!regResponse.ok) {
                const data = await regResponse.json()
                throw new Error(data.detail || "Failed to register")
            }

            // 2. Auto Login after registration
            const urlEncoded = new URLSearchParams()
            urlEncoded.append("username", email)
            urlEncoded.append("password", password)

            const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: urlEncoded
            })

            if (!loginResponse.ok) {
                toast.success("Account created! Please log in.")
                router.push('/login')
                return
            }

            const data = await loginResponse.json()
            toast.success("Welcome to CrediTrust!")
            login(data.access_token, data.user)
            
        } catch (err: any) {
            setError(err.message || "An error occurred during registration")
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-12">
            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />

            <Card className="w-full max-w-md p-8 relative z-10 border-border/50 shadow-2xl bg-card/80 backdrop-blur-xl ring-1 ring-border/50">
                <div className="flex flex-col items-center mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 mb-4">
                        <UserPlus className="h-6 w-6 fill-current" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-center">Create Account</h1>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Join CrediTrust Intelligence</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                        <input 
                            name="name"
                            type="text" 
                            placeholder="Asha Patel"
                            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                        <input 
                            name="email"
                            type="email" 
                            placeholder="asha@creditrust.com"
                            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                        <div className="relative">
                            <input 
                                name="password"
                                type={showPassword ? "text" : "password"} 
                                placeholder="Min. 8 characters"
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

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm Password</label>
                        <input 
                            name="confirm_password"
                            type="password" 
                            placeholder="Repeat password"
                            className="w-full h-12 px-4 rounded-xl border border-border/50 bg-secondary/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                            required
                        />
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
                                Provisioning...
                            </span>
                        ) : (
                            "Create Secure Account"
                        )}
                    </Button>
                    
                    <div className="text-center mt-6 text-xs text-muted-foreground font-medium">
                        Already have an account?{" "}
                        <span onClick={() => router.push('/login')} className="text-primary font-bold hover:underline cursor-pointer">
                            Log In Here
                        </span>
                    </div>
                </form>
            </Card>
        </div>
    )
}
