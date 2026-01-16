"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
    BarChart,
    ChevronLeft,
    ChevronRight,
    Settings,
    ShoppingCart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export function Sidebar({ className }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(false)
    const pathname = usePathname()

    const navItems = [
        {
            title: "Analytics",
            href: "/analytics",
            icon: BarChart,
        },
        {
            title: "Vendas",
            href: "/vendas",
            icon: ShoppingCart,
        },
        {
            title: "Configurações",
            href: "/configuracoes",
            icon: Settings,
        }
    ]

    return (
        <div
            className={cn(
                "relative flex flex-col border-r border-apet-border bg-white transition-all duration-300 ease-in-out font-sans",
                isCollapsed ? "w-[80px]" : "w-[280px]",
                className
            )}
        >
            <div className="flex h-16 items-center border-b border-apet-border px-4 justify-between">
                <div className={cn("flex items-center gap-2", isCollapsed && "justify-center w-full")}>
                    {/* 
                       Logo Logic:
                       If collapsed, show just the 'A' mark or similar. 
                       Since the user provided a full logo, let's use it when expanded.
                       When collapsed, we might need to crop or just hide it? 
                       The user asked to add "essa logo as logo da sidebar".
                       Usually full logo is for expanded state.
                     */}
                    {isCollapsed ? (
                        <div className="h-8 w-8 relative flex items-center justify-center overflow-hidden">
                            {/* Cropped view or just small version - lets try to fit it or fallback to text if it looks bad */}
                            <Image
                                src="/logo-apet.png"
                                alt="APET Logo"
                                width={120}
                                height={40}
                                className="object-cover object-left"
                                style={{ width: 'auto', height: '100%' }}
                            />
                        </div>
                    ) : (
                        <div className="relative h-8 w-full max-w-[140px]">
                            <Image
                                src="/logo-apet.png"
                                alt="APET Logo"
                                fill
                                className="object-contain object-left"
                                priority
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 py-6 px-3 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200",
                                isActive
                                    ? "bg-red-50 text-apet-red shadow-sm border border-red-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-apet-black",
                                isCollapsed && "justify-center px-0 py-3"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5", isActive && "text-apet-red")} />
                            {!isCollapsed && (
                                <span className="font-semibold text-sm">{item.title}</span>
                            )}
                        </Link>
                    )
                })}
            </div>

            <div className="border-t border-apet-border p-4">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-500 hover:text-apet-red"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> :
                        <div className="flex items-center gap-2">
                            <ChevronLeft className="h-4 w-4" />
                            <span>Recolher Menu</span>
                        </div>}
                </Button>
            </div>
        </div>
    )
}
