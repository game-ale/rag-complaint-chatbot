"use client"

import { motion } from "framer-motion"

interface PageTransitionProps {
    children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    )
}
