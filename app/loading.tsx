export default function Loading() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-transparent">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-emerald-500 shadow-lg"></div>
                <p className="text-sm font-medium text-emerald-500 animate-pulse">Loading Farm Data...</p>
            </div>
        </div>
    )
}
