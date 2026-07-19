"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Root() {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            router.push("/dashboard")
        } else {
            router.push("/login")
        }
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
    )
}
