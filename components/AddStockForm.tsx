'use client'

import { addStock } from '@/app/actions/inventory'
import { useFormStatus } from 'react-dom'
import { PlusCircle, AlertTriangle } from 'lucide-react'
import type { Product } from '@/types/inventory'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 transition-all"
        >
            {pending ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
                <PlusCircle className="h-4 w-4" />
            )}
            Add Stock
        </button>
    )
}

interface Props {
    products: Product[]
}

export function AddStockForm({ products }: Props) {
    return (
        <form action={async (formData) => { await addStock(formData) }} className="grid gap-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Select Product</label>
                    <select
                        name="product_id"
                        required
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        defaultValue=""
                    >
                        <option value="" disabled>Choose a product...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name} {p.variant ? `(${p.variant})` : ''} - {p.category?.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
                        <input
                            type="number"
                            name="quantity"
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Batch Number (Optional)</label>
                        <input
                            type="text"
                            name="batch_number"
                            placeholder="e.g. B-2024-001"
                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date</label>
                    <input
                        type="date"
                        name="expiry_date"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 [color-scheme:dark]"
                    />
                    <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Leave blank if non-perishable
                    </p>
                </div>
            </div>

            <div className="pt-2">
                <SubmitButton />
            </div>
        </form>
    )
}
