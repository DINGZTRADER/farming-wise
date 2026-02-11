import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Inventory | Management System",
    description: "AI-Driven Inventory System for Uganda",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark h-full antialiased">
            <body className={`${inter.className} flex h-full bg-slate-950 text-slate-100 overflow-hidden`}>
                <aside className="hidden md:flex h-full shrink-0 z-50">
                    <Sidebar />
                </aside>

                <main className="flex-1 h-full overflow-y-auto w-full relative scroll-smooth bg-slate-950">
                    {/* Ambient Gradient Background */}
                    <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-slate-950 to-slate-950 opacity-80" />

                    <div className="relative z-10 mx-auto max-w-7xl p-6 lg:p-10 mb-20">
                        {children}
                    </div>
                </main>
            </body>
        </html>
    );
}
