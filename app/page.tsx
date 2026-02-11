import { getOverviewData } from './actions/inventory'
import { OverviewStats } from '@/components/OverviewStats'
import { StockTable } from '@/components/StockTable'

export const dynamic = 'force-dynamic'

export default async function Home() {
    let stock = []
    try {
        stock = await getOverviewData()
    } catch (e) {
        console.error("Failed to fetch dashboard data:", e)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-1">
                        Farm Dashboard
                    </h1>
                    <p className="text-slate-400 text-sm">Real-time overview of inventory and alerts.</p>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live Data
                </div>
            </div>

            <OverviewStats stock={stock} />

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Current Stock Levels</h2>
                <StockTable stock={stock} />
            </div>
        </div>
    )
}
