"use client"

import { PageTransition } from "@/components/PageTransition"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShieldCheck, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/authContext"
import { useState } from "react"
import { updateProfile } from "@/lib/api"
import { toast } from "sonner"

export default function ProfilePage() {
    const router = useRouter()
    const { user, logout, login, token } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [name, setName] = useState(user?.name || "")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSave = async () => {
        setIsLoading(true)
        try {
            const updatedUser = await updateProfile(
                name !== user?.name ? name : undefined,
                password ? password : undefined
            )
            // Update auth context
            if (token) {
                login(token, updatedUser)
            }
            toast.success("Profile updated successfully")
            setIsEditing(false)
            setPassword("")
        } catch (err) {
            toast.error("Failed to update profile")
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return null

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
                                {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-3">
                                <ShieldCheck className="h-3 w-3 mr-1" /> {user.role === 'admin' ? 'Admin' : 'Verified'}
                            </Badge>
                        </div>
                        
                        <div className="flex-1 space-y-6 text-center md:text-left w-full">
                            {isEditing ? (
                                <div className="space-y-4 max-w-sm mx-auto md:mx-0">
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full h-10 px-4 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2 text-left">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password (Optional)</label>
                                        <input 
                                            type="password" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Leave blank to keep current"
                                            className="w-full h-10 px-4 rounded-xl border border-border/50 bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button onClick={handleSave} disabled={isLoading} className="rounded-xl font-bold">
                                            {isLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                        <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading} className="rounded-xl font-bold">
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div>
                                        <h2 className="text-3xl font-black">{user.name}</h2>
                                        <p className="text-lg text-muted-foreground font-medium capitalize">{user.role} Operator</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</span>
                                            <p className="text-sm font-bold">{user.email}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                                            <p className="text-sm font-bold text-green-500">Active</p>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-8 flex gap-4 justify-center md:justify-start">
                                        <Button variant="outline" className="rounded-xl border-border/50 font-bold" onClick={() => setIsEditing(true)}>
                                            Edit Profile
                                        </Button>
                                        <Button variant="destructive" className="rounded-xl font-bold shadow-lg shadow-destructive/20" onClick={logout}>
                                            Terminate Session
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Card>
            </div>
        </PageTransition>
    )
}
