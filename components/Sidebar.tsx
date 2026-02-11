'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, PlusCircle, MinusCircle, Sprout } from 'lucide-react'
import { clsx } from 'clsx'

const links = [
    { name: 'Overview', href: '/', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Add Stock', href: '/add-stock', icon: PlusCircle },
    { name: 'Record Usage', href: '/usage', icon: MinusCircle },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950 text-white shadow-2xl">
            <div className="flex items-center justify-center p-6 border-b border-slate-800/50">
                <img src="/logo.png" alt="Logo" className="h-12 w-auto object-contain" />
            </div>
            <nav className="flex-1 space-y-2 px-4 py-8">
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={clsx(
                                'group flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-emerald-500',
                                isActive
                                    ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)] border border-emerald-500/20'
                                    : 'text-slate-400 hover:bg-slate-900 hover:text-white hover:translate-x-1'
                            )}
                        >
                            <Icon className={clsx("h-5 w-5 transition-colors", isActive ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400")} />
                            {link.name}
                        </Link>
                    )
                })}
            </nav>
            <div className="p-6 border-t border-slate-800/50">
                <div className="rounded-xl bg-slate-900/50 p-4 border border-slate-800">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">System Status</p>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <p className="text-xs font-medium text-emerald-400">Operational</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
