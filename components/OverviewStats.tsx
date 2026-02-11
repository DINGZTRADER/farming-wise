'use client'

import { CurrentStock } from '@/types/inventory'
import { differenceInDays, parseISO } from 'date-fns'
import { AlertCircle, ArrowDown, ArrowUp, BarChart3, Package, Timer } from 'lucide-react'

export function OverviewStats({ stock }: { stock: CurrentStock[] }) {
    const totalItems = stock.length
    const lowStockCount = stock.filter(item => item.low_stock_alert).length
    const expiredCount = stock.filter(item => {
        if (!item.soonest_expiry) return false
        return differenceInDays(parseISO(item.soonest_expiry), new Date()) < 0
    }).length
    const expiringCount = stock.filter(item => {
        if (!item.soonest_expiry) return false
        const days = differenceInDays(parseISO(item.soonest_expiry), new Date())
        return days >= 0 && days < 30
    }).length

    const stats = [
        {
            name: 'Total Products',
            value: totalItems,
            icon: Package,
            change: 'Inventory Limit',
            changeType: 'neutral',
        },
        {
            name: 'Low Stock Alerts',
            value: lowStockCount,
            icon: ArrowDown,
            change: 'Restock Required',
            changeType: 'negative',
        },
        {
            name: 'Expired Items',
            value: expiredCount,
            icon: AlertCircle,
            change: 'Action Needed',
            changeType: 'negative',
        },
        {
            name: 'Expiring Soon',
            value: expiringCount,
            icon: Timer,
            change: 'Within 30 Days',
            changeType: 'warning',
        }
    ]

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div key={stat.name} className="relative overflow-hidden rounded-xl bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm border border-slate-800">
                    <dt className="flex items-center gap-3 truncate text-sm font-medium text-slate-400">
                        <div className="rounded-md bg-slate-800 p-2">
                            <stat.icon className={`h-4 w-4 ${stat.changeType === 'negative' ? 'text-rose-500' : stat.changeType === 'warning' ? 'text-amber-500' : 'text-emerald-500'}`} />
                        </div>
                        {stat.name}
                    </dt>
                    <dd className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-semibold tracking-tight text-white">
                            {stat.value}
                        </span>
                        <span className={`text-xs font-medium ${stat.changeType === 'negative' ? 'text-rose-400' :
                            stat.changeType === 'warning' ? 'text-amber-400' :
                                'text-slate-500'
                            }`}
                        >
                            {stat.change}
                        </span>
                    </dd>
                </div>
            ))}
        </div>
    )
}
