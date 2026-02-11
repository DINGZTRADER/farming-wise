import { getProducts } from '@/app/actions/inventory'
import { AddStockForm } from '@/components/AddStockForm'
import { PlusCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AddStockPage() {
    let products = []
    try {
        products = await getProducts()
    } catch (e) { /* ignore */ }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2 group flex items-center gap-3">
                    <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-500 group-hover:bg-emerald-500/30 transition-colors">
                        <PlusCircle className="h-6 w-6" />
                    </div>
                    Add Stock
                </h1>
                <p className="text-slate-400">Receive new inventory items into stock.</p>
            </div>

            <div className="max-w-2xl">
                <AddStockForm products={products} />
            </div>
        </div>
    )
}
