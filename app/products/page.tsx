import { getProducts, getCategories, getSuppliers } from '@/app/actions/inventory'
import { ProductForm } from '@/components/ProductForm'
import { Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const products = await getProducts()
    const categories = await getCategories()
    const suppliers = await getSuppliers()

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Product Management</h1>
                <p className="text-slate-400">Define new inventory items and view catalog.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 sticky top-6">
                    <div className="mb-4 flex items-center gap-2 text-emerald-400">
                        <Package className="h-5 w-5" />
                        <h2 className="text-lg font-semibold text-white">Create New Product</h2>
                    </div>
                    <ProductForm categories={categories} suppliers={suppliers} />
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-semibold text-white mb-4">Product Catalog</h2>
                    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 shadow-xl backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-900/50 text-slate-200">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Name</th>
                                        <th className="px-6 py-3 font-semibold">Category</th>
                                        <th className="px-6 py-3 font-semibold">Variant</th>
                                        <th className="px-6 py-3 font-semibold">Unit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {products.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                                            <td className="px-6 py-3 font-medium text-slate-200">{p.name}</td>
                                            <td className="px-6 py-3">
                                                <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-400 ring-1 ring-inset ring-slate-700/50">
                                                    {p.category?.name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3">{p.variant || '-'}</td>
                                            <td className="px-6 py-3">{p.unit}</td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-slate-500">
                                                No products defined yet. Use the form to add one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
