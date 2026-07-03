import { Head, Link } from '@inertiajs/react';

export default function Error({ status }) {
    // Basic dynamic client check for local application theme mapping
    const dark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    const errors = {
        404: {
            title: 'Index Structure Missing',
            description: "The requested node pointer reference cannot be identified or resolved within this routing table matrix.",
            icon: '🔍',
            color: 'bg-blue-400',
        },
        403: {
            title: 'Authorization Fault',
            description: "Your authentication token context lacks the clearance keys required to bind to this resource matrix.",
            icon: '🔒',
            color: 'bg-red-400',
        },
        500: {
            title: 'Core Server Exception',
            description: 'Runtime exception encountered during runtime instruction compilation. Target thread dropped unexpectedly.',
            icon: '⚠️',
            color: 'bg-amber-400',
        },
        503: {
            title: 'Node Pool Offline',
            description: 'Target data engine pool is temporarily saturated or under active configuration maintenance cycles.',
            icon: '🔧',
            color: 'bg-stone-400',
        },
    };

    const error = errors[status] || errors[404];

    // System tokens mapped to global parameters
    const pageBg = dark ? 'bg-[#121110]' : 'bg-[#fcf8f2]';
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 transition-colors font-sans-custom ${pageBg}`}>
            <Head title={`${status} // ${error.title}`} />
            
            <div className={`max-w-md w-full border-4 border-black rounded-3xl p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${cardBg}`}>
                {/* Neo-brutalist Icon Container */}
                <div className={`w-20 h-20 rounded-2xl border-4 border-black flex items-center justify-center text-4xl mx-auto mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${error.color} text-black`}>
                    {error.icon}
                </div>
                
                {/* Error Status Code Tag */}
                <h1 className="text-7xl font-unique-bold text-red-500 drop-shadow-[3px_3px_0px_#000] uppercase tracking-tighter mb-2">
                    {status}
                </h1>
                
                <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-3 ${textHeader}`}>
                    {error.title}
                </h2>
                
                <p className={`text-xs font-medium leading-relaxed mb-8 ${dark ? 'text-stone-300' : 'text-stone-800'}`}>
                    {error.description}
                </p>
                
                {/* Action Routing Array */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link 
                        href="/" 
                        className="bg-blue-400 text-black border-2 border-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className={`border-2 border-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all ${dark ? 'bg-stone-800 text-stone-300 hover:bg-stone-700' : 'bg-white text-black hover:bg-stone-100'}`}
                    >
                        Go Back
                    </button>
                </div>
                
                {/* Branding Footprint */}
                <div className="mt-8 pt-4 border-t-2 border-dashed border-black/20 dark:border-white/10 flex items-center justify-center gap-1.5">
                    <span className="text-lg drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">📚</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">StudyShare Matrix //</span>
                </div>
            </div>
        </div>
    );
}