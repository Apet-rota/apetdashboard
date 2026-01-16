"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { TopFilterBar } from "@/components/layout/top-filter-bar"
import { FilterProvider } from "@/components/dashboard/filter-context"

interface DashboardShellProps {
    children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
    return (
        <FilterProvider>
            <div className="flex h-screen overflow-hidden bg-background">
                <Sidebar className="hidden md:flex" />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <TopFilterBar />
                    <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                        <div className="mx-auto max-w-7xl animate-in fade-in duration-500">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </FilterProvider>
    )
}
