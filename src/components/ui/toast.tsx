'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Toast, ToastContextType } from '@/types/api-response'

const ToastContext = createContext<ToastContextType | undefined>(undefined)


export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = (message: string, type: Toast['type']) => {
        const id = Math.random().toString(36).substring(2, 9)
        setToasts((prev) => [...prev, { id, message, type }])

        // Auto remove after 3 seconds
        setTimeout(() => {
            removeToast(id)
        }, 3000)
    }

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-xl border text-white transform transition-all duration-300 ease-in-out hover:scale-105 ${toast.type === 'success' ? 'bg-green-600 border-green-500' :
                            toast.type === 'error' ? 'bg-red-600 border-red-500' :
                                'bg-blue-600 border-blue-500'
                            }`}
                    >
                        {toast.type === 'success' && (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        )}
                        {toast.type === 'error' && (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                        {toast.type === 'info' && (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                        <span className="font-semibold text-base">{toast.message}</span>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}
