'use client'

import { CurrentStock } from '@/types/inventory'
import { formatNumber } from '@/lib/utils'
import { parseISO, differenceInDays, format } from 'date-fns'
import { AlertCircle, CheckCircle, Package, AlertTriangle } from 'lucide-react'

// Helper for status badge
function StatusBadge({ lowStock, expiryDate }: { lowStock: boolean, expiryDate: string | null }) {
    const needsReorder = lowStock
    let expiryStatus = 'ok'
    let daysToExpiry = null

    if (expiryDate) {
        daysToExpiry = differenceInDays(parseISO(expiryDate), new Date())
        if (daysToExpiry < 0) expiryStatus = 'expired'
        else if (daysToExpiry < 30) expiryStatus = 'expiring'
    }

    if (expiryStatus === 'expired') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-1 text-xs font-medium text-rose-500 ring-1 ring-inset ring-rose-500/20">
                <AlertCircle className="h-3 w-3" />
                Expired {Math.abs(daysToExpiry!)}d ago
            </span>
        )
    }

    if (needsReorder) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20">
                <AlertTriangle className="h-3 w-3" />
                Low Stock
            </span>
        )
    }

    if (expiryStatus === 'expiring') {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 px-2 py-1 text-xs font-medium text-orange-500 ring-1 ring-inset ring-orange-500/20">
                <AlertTriangle className="h-3 w-3" />
                Expiring in {daysToExpiry}d
            </span>
        )
    }

    return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
            <CheckCircle className="h-3 w-3" />
            Healthy
        </span>
    )
}

export function StockTable({ stock }: { stock: CurrentStock[] }) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-xl backdrop-blur-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900/50 text-slate-200">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold">Product</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Category</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-right">On Hand</th>
                            <th scope="col" className="px-6 py-4 font-semibold text-right">Threshold</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {stock.map((item) => (
                            <tr key={item.product_id} className="transition-colors hover:bg-slate-800/30">
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-slate-800 p-2">
                                            <Package className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-200">{item.name}</div>
                                            <div className="text-xs text-slate-500">{item.variant}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-700/50">
                                        {item.category_name}
                                    </span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-200">
                                    {formatNumber(item.quantity_on_hand)} <span className="text-xs text-slate-500 font-normal">{item.unit}</span>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-slate-500">
                                    {item.reorder_threshold}
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <StatusBadge lowStock={item.low_stock_alert} expiryDate={item.soonest_expiry} />
                                </td>
                            </tr>
                        ))}
                        {stock.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500">
                                    No inventory data found. Add stock to begin.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
