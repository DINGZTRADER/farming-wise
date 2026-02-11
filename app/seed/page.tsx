'use client'

import { seedInventory } from '@/app/actions/seed'
import { useFormStatus } from 'react-dom'
import { Database, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-emerald-500 disabled:opacity-50 transition-all"
        >
            {pending ? (
                <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Seeding Database...
                </span>
            ) : (
                <>
                    <Database className="h-5 w-5" />
                    Start Seeding Process
                </>
            )}
        </button>
    )
}

export default function SeedPage() {
    const [result, setResult] = useState<any>(null)

    async function handleSeed(formData: FormData) {
        const res = await seedInventory()
        setResult(res)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">System Initialization</h1>
                <p className="text-slate-400">Import initial inventory data from the legacy spreadsheet.</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl backdrop-blur-sm">
                <div className="mb-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <h3 className="text-sm font-medium text-slate-300 mb-2">What this does:</h3>
                    <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
                        <li>Creates Categories (Fertilisers, Pesticides, etc.)</li>
                        <li>Creates Suppliers</li>
                        <li>Registers Products and Variants</li>
                        <li>Imports Initial Stock Batches</li>
                        <li>Sets Expiry Dates where provided</li>
                    </ul>
                </div>

                <form action={handleSeed}>
                    <SubmitButton />
                </form>

                {result && (
                    <div className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                        <div className="flex items-center gap-2 mb-2 font-semibold">
                            <CheckCircle className="h-5 w-5" />
                            Success!
                        </div>
                        <p className="text-sm">Database has been populated with the initial inventory.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
