import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/hooks/useTheme';

export default function Dashboard({ auth, stats, recentResources, recentActivity }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const name = auth?.user?.name || 'Student';
    const firstName = name.split(' ')[0];
    const initial = name.charAt(0).toUpperCase();

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    // Current formatted timestamp matching the real-time layout header from image_f1403c.jpg
    const formattedTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

    const metricCards = [
        { label: 'Resources uploaded', value: stats?.uploaded ?? 0,      accent: '#f59e0b', icon: '📤' },
        { label: 'Resources saved',    value: stats?.favorites ?? 0,     accent: '#ef4444', icon: '❤️' },
        { label: 'Study groups',       value: stats?.groups ?? 0,        accent: '#a855f7', icon: '👥' },
        { label: 'Study streak',       value: `${stats?.streak ?? 0}d`,  accent: '#10b981', icon: '🔥' },
    ];

    // Rearranged mapping structure to mirror the horizontal micro-link column blocks of image_f1403c.jpg
    const quickLinks = [
        { href: '/student/browse',      label: 'Browse',        sub: 'Find resources',     icon: '🔍', color: 'bg-blue-400' },
        { href: '/student/upload',      label: 'Upload',        sub: 'Share your notes',   icon: '📤', color: 'bg-purple-400' },
        { href: '/student/groups',      label: 'Groups',        sub: 'Study together',     icon: '👥', color: 'bg-emerald-400' },
        { href: '/student/ai-analyzer', label: 'AI Study',      sub: 'Analyze your PDFs',  icon: '🤖', color: 'bg-amber-400' },
        { href: '/student/pomodoro',    label: 'Favorites',     sub: 'Saved resources',    icon: '❤️', color: 'bg-rose-400' },
        { href: '/student/library',     label: 'Library',       sub: 'Your uploads',       icon: '📚', color: '#06b6d4' },
    ];

    // Neo-Brutalist Theme definitions matching your Welcome implementation
    const baseBg      = dark ? 'bg-[#121110]' : 'bg-[#fcf8f2]';
    const surface     = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const cardBg      = dark ? 'bg-[#262320] border-[#3b352e]' : 'bg-white border-[#1a1a1a]';
    const strong      = dark ? 'text-stone-100' : 'text-[#1a1a1a]';
    const muted       = dark ? 'text-stone-400' : 'text-stone-600';
    const divider     = dark ? 'border-[#2e2a24]' : 'border-[#1a1a1a]';
    const textInverse = dark ? 'text-black' : 'text-white';
    const hoverBg     = dark ? 'hover:bg-[#2c2824]' : 'hover:bg-[#fdf8f0]';

    return (
        <MainLayout auth={auth}>
            <Head title="Dashboard — StudyShare" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                .font-display { font-family: 'Syne', sans-serif; }
                .font-sans-custom { font-family: 'Plus Jakarta Sans', sans-serif; }
                .neo-shadow { box-shadow: 4px 4px 0px 0px #1a1a1a; }
                .neo-shadow-lg { box-shadow: 6px 6px 0px 0px #1a1a1a; }
                .neo-shadow-sm { box-shadow: 2px 2px 0px 0px #1a1a1a; }
                .neo-interactive:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px 0px #1a1a1a; }
            `}</style>

            <div className={`space-y-6 font-sans-custom p-2 sm:p-4 ${baseBg} transition-colors duration-300`}>

                {/* ── Welcome Banner Block ── */}
                <div className={`rounded-3xl p-6 sm:p-8 border-2 border-b-[10px] border-black text-left relative overflow-hidden ${surface} neo-shadow-lg`}>
                    
                    {/* Floating Hand-Drawn SVG Accent Elements */}
                    <div className="absolute right-12 top-6 opacity-15 dark:opacity-5 pointer-events-none hidden md:block">
                        <svg width="85" height="70" viewBox="0 0 85 70" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M10 10 L25 25 L40 10 L55 25 L70 10" strokeLinecap="round" />
                            <circle cx="25" cy="50" r="8" fill="currentColor" />
                            <path d="M60 45 L75 60" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-2">
                            <div className={`text-xs font-mono font-bold uppercase tracking-wider ${muted}`}>
                                {formattedTime} · {formattedDate}
                            </div>
                            <h1 className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight ${strong}`}>
                                {greeting}, {firstName}! <span className="text-amber-500 inline-block animate-bounce">👋</span>
                            </h1>
                            <p className={`text-sm max-w-xl font-medium ${muted}`}>
                                Ready to study? Here's what's new on StudyShare workspace networks today.
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href="/student/browse" className="bg-white hover:bg-stone-100 text-black text-xs font-bold px-4 py-2.5 rounded-xl border-2 border-black neo-shadow-sm neo-interactive transition-all">
                                Browse Resources
                            </Link>
                            <Link href="/student/upload" className="bg-black hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl border-2 border-black neo-shadow-sm neo-interactive transition-all">
                                Upload Asset
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Shortcuts Matrix Section ── */}
                <div className="w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {quickLinks.map((ql) => (
                            <Link
                                key={ql.href}
                                href={ql.href}
                                className={`flex flex-col items-center text-center p-4 rounded-2xl border-2 border-b-6 border-black bg-white hover:bg-amber-50/50 text-black neo-shadow-sm neo-interactive transition-all`}
                            >
                                <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-xl mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${ql.color || 'bg-amber-300'}`}>
                                    {ql.icon}
                                </div>
                                <div className="space-y-0.5 min-w-0 w-full">
                                    <p className="text-xs font-black tracking-tight text-stone-950 truncate">{ql.label}</p>
                                    <p className="text-[10px] text-stone-500 font-medium truncate">{ql.sub}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Metric Performance Counters ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {metricCards.map((m) => (
                        <div key={m.label} className={`rounded-2xl p-4 border-2 border-b-6 border-black ${cardBg} neo-shadow-sm`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xl">{m.icon}</span>
                                <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded border border-black bg-black text-white">
                                    Stat
                                </span>
                            </div>
                            <h3 className={`font-display text-2xl font-black ${strong}`}>{m.value}</h3>
                            <p className={`text-[10px] font-bold uppercase tracking-tight ${muted}`}>{m.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Content Layout Hub ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Panel: Recently Added Resources */}
                    <div className={`lg:col-span-2 rounded-3xl border-2 border-b-8 border-black ${surface} overflow-hidden`}>
                        <div className={`px-6 py-4 border-b-2 ${divider} flex items-center justify-between bg-amber-400/10`}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🗂️</span>
                                <h2 className={`font-display text-sm font-black uppercase tracking-tight ${strong}`}>Recently Added Materials</h2>
                            </div>
                            <Link href="/student/library" className="text-xs font-bold text-amber-500 hover:underline">
                                View all →
                            </Link>
                        </div>

                        {recentResources && recentResources.length > 0 ? (
                            <div className="divide-y-2" style={{ borderColor: dark ? '#2e2a24' : '#1a1a1a' }}>
                                {recentResources.slice(0, 4).map((r, i) => (
                                    <div key={r.id || i} className={`p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${hoverBg} transition-colors`}>
                                        <div className="flex items-start gap-4 min-w-0">
                                            {/* Micro Badge Element */}
                                            <div className="w-10 h-10 rounded-xl border-2 border-black bg-purple-300 text-black flex flex-col items-center justify-center flex-shrink-0 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                <span className="text-[10px] font-black">{r.file_type?.toUpperCase()?.slice(0,3) || 'PDF'}</span>
                                            </div>
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className={`text-sm font-bold truncate ${strong}`}>{r.title}</p>
                                                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded border border-black bg-white text-black">
                                                        {r.status || 'Active'}
                                                    </span>
                                                </div>
                                                <p className={`text-xs ${muted}`}>
                                                    {r.subject || r.category || 'General Subject'} · <span className="font-mono">{r.created_at || 'Recent'}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end">
                                            <Link href={`/student/resources/${r.id}`} className="bg-black hover:bg-stone-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-black neo-shadow-sm neo-interactive transition-all">
                                                Open File
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center space-y-2">
                                <span className="text-3xl">📥</span>
                                <h4 className={`text-sm font-bold ${strong}`}>No files dropped yet</h4>
                                <p className={`text-xs ${muted}`}>Your recent shared batch documentation assets appear here.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Feed Log activity logs */}
                    <div className={`rounded-3xl border-2 border-b-8 border-black ${surface} overflow-hidden flex flex-col`}>
                        <div className={`px-6 py-4 border-b-2 ${divider} flex items-center justify-between bg-purple-500/10`}>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🔔</span>
                                <h2 className={`font-display text-sm font-black uppercase tracking-tight ${strong}`}>Activity Feed</h2>
                            </div>
                        </div>

                        <div className="flex-1 p-4 divide-y-2 divide-dashed divide-stone-300 dark:divide-stone-700 overflow-y-auto max-h-[290px]">
                            {recentActivity && recentActivity.length > 0 ? (
                                recentActivity.slice(0, 5).map((a, i) => (
                                    <div key={i} className={`flex items-start gap-3 py-3 first:pt-0 last:pb-0 px-1`}>
                                        <span className="text-base flex-shrink-0 mt-0.5">{a.icon || '⚡'}</span>
                                        <div className="min-w-0">
                                            <p className={`text-xs font-bold ${strong} leading-tight`}>{a.message}</p>
                                            <p className={`text-[10px] font-medium ${muted} mt-0.5`}>{a.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center py-12 text-center opacity-60">
                                    <span className="text-2xl">🌱</span>
                                    <p className="text-xs font-bold mt-1">System feed clean.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── AI Callout Assistant Banner ── */}
                <div className="w-full rounded-2xl border-2 border-b-6 border-black bg-black text-white p-5 neo-shadow relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 text-7xl opacity-10 pointer-events-none select-none">🤖</div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-400 border-2 border-white rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                                🤖
                            </div>
                            <div>
                                <h4 className="text-sm font-black uppercase tracking-wide text-amber-400">Try the AI Study Assistant</h4>
                                <p className="text-xs text-stone-300 mt-0.5 font-medium">
                                    Upload any PDF or workbook schema to construct localized dynamic summary cards and immediate flashcards.
                                </p>
                            </div>
                        </div>
                        <Link href="/student/ai-analyzer" className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-black px-4 py-2.5 rounded-xl border-2 border-white tracking-tight text-center whitespace-nowrap neo-interactive transition-all">
                            Try AI Analyzer →
                        </Link>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}