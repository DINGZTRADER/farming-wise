'use client'

import { createProduct } from '@/app/actions/inventory'
import { useFormStatus } from 'react-dom'
import { PlusCircle } from 'lucide-react'
import type { Category, Supplier } from '@/types/inventory'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
            {pending ? (
                <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Adding...
                </span>
            ) : (
                <>
                    <PlusCircle className="h-4 w-4" />
                    Create Product
                </>
            )}
        </button>
    )
}

interface ProductFormProps {
    categories: Category[]
    suppliers: Supplier[]
}

export function ProductForm({ categories, suppliers }: ProductFormProps) {
    return (
        <form action={async (formData) => { await createProduct(formData) }} className="grid gap-6 rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-sm">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-slate-300">
                        Product Name
                    </label>
                    <input
                        id="name"
                        name="name"
                        autoComplete="off"
                        required
                        placeholder="e.g. Yaramila NPK 25.5.5"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="variant" className="text-sm font-medium text-slate-300">
                        Variant (Size/Type)
                    </label>
                    <input
                        id="variant"
                        name="variant"
                        placeholder="e.g. 50 kg bags"
                        autoComplete="off"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="category_id" className="text-sm font-medium text-slate-300">
                        Category
                    </label>
                    <select
                        id="category_id"
                        name="category_id"
                        required
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                        defaultValue=""
                    >
                        <option value="" disabled>Select Category</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="supplier_id" className="text-sm font-medium text-slate-300">
                        Supplier
                    </label>
                    <select
                        id="supplier_id"
                        name="supplier_id"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    >
                        <option value="">None / Unknown</option>
                        {suppliers.map((s) => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="unit" className="text-sm font-medium text-slate-300">
                        Unit of Measure
                    </label>
                    <select
                        id="unit"
                        name="unit"
                        required
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    >
                        {['kg', 'litres', 'pcs', 'bags', 'boxes', 'pairs', 'meters'].map(u => (
                            <option key={u} value={u}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="reorder_threshold" className="text-sm font-medium text-slate-300">
                        Reorder Alert Threshold
                    </label>
                    <input
                        id="reorder_threshold"
                        name="reorder_threshold"
                        type="number"
                        defaultValue={5}
                        min="0"
                        step="0.1"
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                </div>
            </div>

            <div className="pt-2">
                <SubmitButton />
            </div>
        </form>
    )
}
