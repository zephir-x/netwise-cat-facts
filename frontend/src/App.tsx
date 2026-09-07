import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Cat, Loader2, Sparkles, Quote, BookOpen } from 'lucide-react'
import * as React from "react";

// Data Models
interface CatFactResponse {
    fact: string;
    length: number;
}

export default function App() {
    const [currentFact, setCurrentFact] = useState<string | null>(null);

    // Data Fetching Mutation
    const fetchFactMutation = useMutation({
        mutationFn: async () => {
            const response = await api.get<CatFactResponse>('/facts/random');
            return response.data;
        },
        onSuccess: (data) => {
            setCurrentFact(data.fact);
            toast.success('Fact acquired and synced with Azure!');
        },
        onError: () => {
            toast.error('Failed to fetch a cat fact. Check the connection.');
        }
    });

    // Easter Egg Handler
    const handleEasterEgg = () => {
        toast.success('Thanks for checking out the app! Redirecting...', {
            icon: '🚀'
        });
        setTimeout(() => {
            window.open('https://kacpergumulak.pl/', '_blank');
        }, 3000);
    };

    return (
        // Main Layout
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 relative overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Hero Section */}
            <div className="text-center mb-12 relative z-10">
                {/* Interactive Cat */}
                <div
                    onClick={handleEasterEgg}
                    className="group cursor-pointer inline-flex items-center justify-center p-4 mb-4 transition-all duration-500"
                >
                    <Cat className="w-16 h-16 text-indigo-400 transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12 group-hover:text-purple-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]" />
                </div>

                {/* Animated Synchronized Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight mb-4 flex items-center justify-center">
                    {Array.from("Netwise Cat Facts").map((char, index) => (
                        <span
                            key={index}
                            className={char === " " ? "title-wave-space" : "title-wave-letter"}
                            style={{ "--wave-index": index } as React.CSSProperties}
                        >
                            {char}
                        </span>
                    ))}
                </h1>

                <p className="text-slate-400 text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 font-light text-center">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
                    <span className="leading-tight">Discover something new. Synced with Azure.</span>
                </p>
            </div>

            {/* Minimalist Content Card */}
            <Card className="w-full max-w-2xl bg-slate-900/40 backdrop-blur-xl border-indigo-500/10 shadow-2xl relative z-10">
                <CardContent className="p-10 flex flex-col items-center gap-10">
                    {/* Fact Display Area (Scrollable & Fixed Height) */}
                    <div className="h-60 w-full rounded-2xl relative overflow-hidden group transition-all duration-500 bg-slate-900/30 border border-indigo-500/10 shadow-inner">
                        {/* Decorative Quotes (Fixed in background) */}
                        <Quote className="absolute top-4 left-4 w-10 h-10 text-indigo-500/10 transition-all duration-700 group-hover:text-indigo-500/20 group-hover:-translate-y-1 group-hover:-translate-x-1 z-0 pointer-events-none" />
                        <Quote className="absolute bottom-4 right-4 w-10 h-10 text-indigo-500/10 rotate-180 transition-all duration-700 group-hover:text-indigo-500/20 group-hover:translate-y-1 group-hover:translate-x-1 z-0 pointer-events-none" />

                        {/* Scrollable Text Container */}
                        <div className="w-full h-full overflow-y-auto scrollbar-none [&::-webkit-scrollbar]:hidden relative z-10">
                            <div className="min-h-full flex items-center justify-center p-8">
                                {currentFact ? (
                                    <p key={currentFact} className="text-xl md:text-2xl font-medium text-slate-200 italic leading-relaxed text-center animate-in fade-in duration-500">
                                        "{currentFact}"
                                    </p>
                                ) : (
                                    <p className="text-slate-500 text-lg flex items-center gap-2 font-light">
                                        Awaiting input...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button
                        size="lg"
                        className="w-full sm:w-auto text-lg px-12 py-7 cursor-pointer bg-linear-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-size-[200%_auto] hover:bg-position-[right_center] text-white border-none shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all duration-500 rounded-2xl font-semibold tracking-wide"
                        onClick={() => fetchFactMutation.mutate()}
                        disabled={fetchFactMutation.isPending}
                    >
                        {fetchFactMutation.isPending ? (
                            <>
                                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                Syncing...
                            </>
                        ) : (
                            'Discover a Fact'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Animated Documentation Link */}
            <a
                href="https://github.com/zephir-x/netwise-cat-facts"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-8 flex items-center gap-3 text-slate-400 hover:text-indigo-400 transition-all duration-300 group"
            >
                <BookOpen className="w-5 h-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                <span className="text-sm font-medium tracking-wider uppercase relative overflow-hidden">
                    Project Documentation
                    <span className="absolute bottom-0 left-0 w-full h-px bg-indigo-400 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out" />
                </span>
            </a>
        </div>
    )
}