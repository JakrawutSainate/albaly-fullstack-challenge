'use client'

import { useEffect, useState } from 'react'

interface HasRoleProps {
    role: 'ADMIN' | 'VIEWER'
    children: React.ReactNode
    userRole?: string
}

export function HasRole({ role, children, userRole }: HasRoleProps) {
    // If userRole is provided (e.g. from server component prop), use it.
    // Otherwise, we might need a way to get it client-side.
    // For this simple implementation, we'll assume it's passed or we'd read a cookie (not secure for strictly sensitive data, but okay for UI hiding).
    // BETTER: The parent Server Component should check the role and conditionally render this, 
    // OR this component receives the role from a context/hook.

    // Since the prompt asks for a "HasRole component to conditionally render", 
    // and we want this to be secure, strictly speaking logic should be 
    // "Passed from Server" or "Checked in Server Action".
    // But for a UI utility, we often pass the current user's role to it.

    // Simplest robust way for UI gating without complex context:
    if (userRole === role || userRole === 'ADMIN') { // Admin usually has access to everything, or strictly match
        // If the requirement is "Admin only", then:
        if (role === 'ADMIN' && userRole !== 'ADMIN') return null
        return <>{children}</>
    }

    return null
}
