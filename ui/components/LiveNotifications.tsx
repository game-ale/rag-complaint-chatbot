"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { usePathname } from "next/navigation"

const ALERT_POOL = [
    { title: "High-Severity Fraud", body: "New credit card fraud complaint flagged in New York", type: "destructive" as const },
    { title: "Spike Detected", body: "Mortgage complaints up 12% in Florida this week", type: "warning" as const },
    { title: "Compliance Alert", body: "Student loan narrative coverage dropped below 80%", type: "warning" as const },
    { title: "New Cluster Found", body: "AI detected emerging pattern: 'hidden fees' in checking accounts", type: "info" as const },
    { title: "Resolution Update", body: "67 debt collection cases resolved with monetary relief", type: "success" as const },
    { title: "Regulatory Flag", body: "Payday lending complaints exceed quarterly threshold", type: "destructive" as const },
    { title: "Trend Shift", body: "Vehicle loan issues shifting from rates to repossession tactics", type: "info" as const },
    { title: "Volume Surge", body: "Credit reporting complaints increased 23% month-over-month", type: "warning" as const },
]

export function LiveNotifications() {
    const pathname = usePathname()

    useEffect(() => {
        // Don't fire notifications on login/register pages
        if (pathname === '/login' || pathname === '/register' || pathname === '/') return

        // Fire first notification after 30s, then every 60s
        const timeout = setTimeout(() => {
            fireNotification()
        }, 30000)

        const interval = setInterval(() => {
            fireNotification()
        }, 60000)

        return () => {
            clearTimeout(timeout)
            clearInterval(interval)
        }
    }, [pathname])

    const fireNotification = () => {
        const alert = ALERT_POOL[Math.floor(Math.random() * ALERT_POOL.length)]
        const states = ["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"]
        const state = states[Math.floor(Math.random() * states.length)]

        if (alert.type === "destructive") {
            toast.error(alert.title, {
                description: alert.body.replace(/New York|Florida/, state),
                duration: 5000,
            })
        } else if (alert.type === "warning") {
            toast.warning(alert.title, {
                description: alert.body,
                duration: 4000,
            })
        } else if (alert.type === "success") {
            toast.success(alert.title, {
                description: alert.body,
                duration: 4000,
            })
        } else {
            toast.info(alert.title, {
                description: alert.body,
                duration: 4000,
            })
        }
    }

    return null // This component only fires side-effects
}
