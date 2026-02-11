'use client'

import { recordUsage } from '@/app/actions/inventory'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { MinusCircle, Calendar, AlertCircle } from 'lucide-react'
import type { Product, BatchRemaining } from '@/types/inventory'
import { formatNumber } from '@/lib/utils'
import { format, parseISO } from 'date-fns'

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending || disabled}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50 transition-all"
        >
            {pending ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
                <MinusCircle className="h-4 w-4" />
            )}
            Record Usage
        </button>
    )
}

interface Props {
    products: Product[]
    batches: BatchRemaining[]
}

export function UsageForm({ products, batches }: Props) {
    const [selectedProductId, setSelectedProductId] = useState<string>('')
    const [selectedBatchId, setSelectedBatchId] = useState<string>('')

    // Filter batches for selected product
    const activeBatches = batches.filter(b => b.product_id === selectedProductId)
    const selectedBatch = activeBatches.find(b => b.batch_id === selectedBatchId)

    // Auto-select batch if only one exists
    if (selectedProductId && activeBatches.length === 1 && !selectedBatchId) {
        setSelectedBatchId(activeBatches[0].batch_id)
    }

    return (
        <form action={async (formData) => { await recordUsage(formData) }} className="grid gap-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Select Product</label>
                    <select
                        value={selectedProductId}
                        onChange={(e) => {
                            setSelectedProductId(e.target.value)
                            setSelectedBatchId('')
                        }}
                        required
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    >
                        <option value="" disabled>Choose a product...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name} {p.variant ? `(${p.variant})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedProductId && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Select Batch to Deduct From</label>
                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {activeBatches.length === 0 ? (
                                    <div className="p-4 rounded-lg bg-slate-800/50 text-slate-400 text-sm text-center border border-dashed border-slate-700">
                                        No active stock batches found for this product.
                                    </div>
                                ) : (
                                    activeBatches.map(batch => (
                                        <label key={batch.batch_id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedBatchId === batch.batch_id ? 'border-rose-500 bg-rose-500/10' : 'border-slate-700 hover:bg-slate-800'}`}>
                                            <input
                                                type="radio"
                                                name="batch_id"
                                                value={batch.batch_id}
                                                checked={selectedBatchId === batch.batch_id}
                                                onChange={() => setSelectedBatchId(batch.batch_id)}
                                                className="mt-1 text-rose-600 focus:ring-rose-500 bg-slate-900 border-slate-600"
                                            />
                                            <div className="flex-1 text-sm">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-medium text-slate-200">
                                                        {batch.batch_number || 'Unnamed Batch'}
                                                    </span>
                                                    <span className="font-bold text-emerald-400">
                                                        {formatNumber(batch.quantity_remaining)} remaining
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-slate-400">
                                                    {batch.expiry_date && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            Exp: {format(parseISO(batch.expiry_date), 'MMM d, yyyy')}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        Created: {batch.created_at ? format(parseISO(batch.created_at), 'MMM d, yyyy') : 'Unknown'}
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>

                        {selectedBatch && (
                            <div className="animate-in fade-in">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Quantity to Use</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            required
                                            min="0.01"
                                            max={selectedBatch.quantity_remaining}
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                        />
                                        <p className="mt-1 text-xs text-slate-500">Max: {selectedBatch.quantity_remaining}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1">Reason (Optional)</label>
                                        <input
                                            type="text"
                                            name="reason"
                                            placeholder="e.g. Field Application"
                                            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-2">
                <SubmitButton disabled={!selectedBatchId} />
            </div>
        </form>
    )
}
