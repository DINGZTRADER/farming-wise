import { getProducts, getAllActiveBatches } from '@/app/actions/inventory'
import { UsageForm } from '@/components/UsageForm'
import { MinusCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function UsagePage() {
    let products = []
    let batches = []

    try {
        const [p, b] = await Promise.all([
            getProducts(),
            getAllActiveBatches()
        ])
        products = p
        batches = b
    } catch (e) {
        console.error("Failed to load usage data", e)
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 group flex items-center gap-3">
                    <div className="rounded-full bg-rose-500/20 p-2 text-rose-500 group-hover:bg-rose-500/30 transition-colors">
                        <MinusCircle className="h-6 w-6" />
                    </div>
                    Record Usage
                </h1>
                <p className="text-slate-400">Log product usage from specific batches.</p>
            </div>

            <div className="max-w-2xl">
                <UsageForm products={products} batches={batches} />
            </div>
        </div>
    )
}
