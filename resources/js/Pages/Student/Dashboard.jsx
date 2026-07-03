import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';

const fileIcons = { pdf: '📕', pptx: '📊', docx: '📝' };

const quickLinks = [
    { href: '/student/browse',      icon: '🔍', label: 'Browse',    desc: 'Find resources',     color: 'bg-blue-400' },
    { href: '/student/upload',      icon: '📤', label: 'Upload',    desc: 'Share your notes',   color: 'bg-purple-400' },
    { href: '/student/groups',      icon: '👥', label: 'Groups',    desc: 'Study together',     color: 'bg-emerald-400' },
    { href: '/student/ai-analyzer', icon: '🤖', label: 'AI Study',  desc: 'Analyze your PDFs',  color: 'bg-amber-400' },
    { href: '/student/favorites',   icon: '❤️', label: 'Favorites', desc: 'Saved resources',    color: 'bg-rose-400' },
    { href: '/student/library',     icon: '📚', label: 'Library',   desc: 'Your uploads',       color: 'bg-cyan-400' },
];

function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-0.5 bg-white dark:bg-[#1c1a18] border-2 border-black rounded-lg px-2 py-0.5 w-fit shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-xs ${s <= Math.round(rating) ? 'text-yellow-500' : 'text-stone-300 dark:text-stone-700'}`}>★</span>
            ))}
            <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300 ml-1">{rating > 0 ? rating : 'No ratings'}</span>
        </div>
    );
}

export default function Dashboard({ auth, resources }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const [greeting, setGreeting] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        const update = () => {
            const h = new Date().getHours();
            setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        };
        update();
        const t = setInterval(update, 60000);
        return () => clearInterval(t);
    }, []);

    const baseBg      = dark ? 'bg-[#121110]' : 'bg-[#fcf8f2]';
    const surface     = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const cardBg      = dark ? 'bg-[#262320] border-[#3b352e]' : 'bg-white border-[#1a1a1a]';
    const strong      = dark ? 'text-stone-100' : 'text-[#1a1a1a]';
    const muted       = dark ? 'text-stone-400' : 'text-stone-600';
    const divider     = dark ? 'border-[#2e2a24]' : 'border-[#1a1a1a]';
    const hoverBg     = dark ? 'hover:bg-[#2c2824]' : 'hover:bg-[#fdf8f0]';

    return (
        <MainLayout auth={auth}>
            <Head title="Dashboard — StudyShare" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                
                /* Class to match the ultra-condensed heavy rounded style of image_f0d3bf.jpg */
                .font-unique-bold { 
                    font-family: 'Big Shoulders Display', sans-serif; 
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                }
                
                .font-sans-custom { font-family: 'Plus Jakarta Sans', sans-serif; }
                
                .neo-shadow { box-shadow: 4px 4px 0px 0px #1a1a1a; }
                .neo-shadow-lg { box-shadow: 8px 8px 0px 0px #1a1a1a; }
                .neo-shadow-sm { box-shadow: 2px 2px 0px 0px #1a1a1a; }
                
                .neo-interactive {
                    transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .neo-interactive:hover {
                    transform: translate(-2px, -2px);
                    box-shadow: 5px 5px 0px 0px #1a1a1a;
                }
                .neo-interactive:active {
                    transform: translate(2px, 2px);
                    box-shadow: 0px 0px 0px 0px #1a1a1a;
                }

                .neo-card-hover {
                    transition: all 0.2s ease-in-out;
                }
                .neo-card-hover:hover {
                    transform: translateY(-4px);
                    box-shadow: 6px 6px 0px 0px #1a1a1a;
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(2deg); }
                }
                .animate-float { animation: float 4s ease-in-out infinite; }
            `}</style>

            <div className={`space-y-6 font-sans-custom p-2 sm:p-4 ${baseBg} transition-colors duration-300 min-h-screen`}>

                {/* ── Hero Greeting Banner with Column Graphic Area ── */}
                <div className={`rounded-3xl p-6 sm:p-8 border-2 border-b-[10px] border-black text-left relative overflow-hidden ${surface} neo-shadow-lg`}>
                    
                    {/* Brutalist Grid Paper Overlay Pattern */}
                    <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                    <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 relative z-10">
                        
                        {/* Left Info Column */}
                        <div className="flex-1 flex flex-col justify-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border-2 border-black bg-amber-300 text-black font-mono font-bold text-xs uppercase tracking-wider w-fit shadow-sm">
                                🚀 LEVEL UP YOUR SESSION
                            </div>
                            <div className="space-y-1">
                                <div className={`text-xs font-mono font-bold uppercase tracking-wider ${muted}`}>
                                    {time} · {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                                </div>
                                <h1 className={`font-unique-bold text-5xl sm:text-7xl tracking-tight leading-none ${strong}`}>
                                    {greeting}, <span className="text-purple-500 underline decoration-4 underline-offset-1">{auth?.user?.name?.split(' ')[0] || 'Student'}</span>! 👋
                                </h1>
                            </div>
                            <p className={`text-sm sm:text-base max-w-xl font-medium leading-relaxed ${muted}`}>
                                Welcome back to your unified core workspace. Download high-tier notes, run instant file conversions, or sync notes across your batch circles.
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link href="/student/browse" className="bg-white hover:bg-stone-100 text-black text-xs font-black px-5 py-3 rounded-xl border-2 border-black neo-shadow-sm neo-interactive transition-all">
                                    Browse Shared Vault
                                </Link>
                                <Link href="/student/upload" className="bg-black hover:bg-stone-800 text-white text-xs font-black px-5 py-3 rounded-xl border-2 border-black neo-shadow-sm neo-interactive transition-all">
                                    Upload Document
                                </Link>
                            </div>
                        </div>

                        {/* Right Decorative Graphic Column (Fills Space + Attracts Focus) */}
                        <div className="hidden lg:flex items-center justify-end flex-shrink-0 w-72 relative">
                            <div className="w-full h-48 bg-amber-400 rounded-2xl border-2 border-b-8 border-black flex flex-col justify-between p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-[3deg] animate-float relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full pointer-events-none" />
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl">📚</span>
                                    <span className="bg-black text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-black">GEN-Z HUB</span>
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-unique-bold text-2xl text-black leading-tight">StudyShare Collective</h3>
                                    <p className="text-[11px] text-black/80 font-bold">100% Peer Verified Materials</p>
                                </div>
                            </div>
                            
                            {/* Accent Background Star Shape badge */}
                            <div className="absolute -left-6 top-6 bg-purple-500 text-white text-xs font-black p-2 rounded-lg border-2 border-black rotate-[-12deg] shadow-md select-none">
                                ✦ PERSISTENT
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Quick Action Matrix Bar ── */}
                <div className="w-full">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {quickLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex flex-col items-center text-center p-3 rounded-2xl border-2 border-b-6 border-black bg-white hover:bg-amber-50/40 text-black neo-shadow-sm neo-interactive transition-all group"
                            >
                                <div className={`w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center text-xl mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:scale-110 ${link.color}`}>
                                    {link.icon}
                                </div>
                                <div className="space-y-0.5 min-w-0 w-full">
                                    <p className="text-xs font-black tracking-tight text-stone-950 truncate">{link.label}</p>
                                    <p className="text-[10px] text-stone-500 font-medium hidden sm:block truncate">{link.desc}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* ── Recent Resources Container ── */}
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🆕</span>
                                <h2 className={`font-unique-bold text-2xl tracking-tight ${strong}`}>Recently Added Assets</h2>
                            </div>
                            <p className={`text-xs mt-0.5 ${muted}`}>Latest approved resources from the community</p>
                        </div>
                        <Link href="/student/browse" className="text-xs font-bold text-amber-500 hover:underline transition-colors">
                            View all →
                        </Link>
                    </div>

                    {resources.length === 0 ? (
                        <div className={`rounded-3xl border-2 border-b-8 border-black ${surface} text-center py-20 space-y-4 neo-shadow relative overflow-hidden`}>
                            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
                            
                            <div className="text-6xl animate-float inline-block">📭</div>
                            <h4 className={`text-lg font-extrabold ${strong} relative z-10`}>No shared resources found</h4>
                            <p className={`text-xs ${muted} max-w-xs mx-auto relative z-10`}>
                                Be the first to drop code fragments, summaries, or past exams to claim community points.
                            </p>
                            <Link href="/student/upload" className="inline-block bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs px-6 py-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#1a1a1a] neo-interactive transition-all">
                                Upload Now
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {resources.map(r => (
                                <div
                                    key={r.id}
                                    className={`rounded-2xl p-4 border-2 border-b-6 border-black ${cardBg} flex flex-col justify-between gap-4 shadow-[3px_3px_0px_0px_#1a1a1a] neo-card-hover transition-all cursor-pointer group`}
                                    onClick={() => window.location.href = '/student/download/' + r.id}
                                >
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className={`w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center text-2xl flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-6 ${
                                                    r.file_type === 'pdf'  ? 'bg-rose-200'    :
                                                    r.file_type === 'pptx' ? 'bg-orange-200' : 'bg-blue-200'
                                                }`}>
                                                    {fileIcons[r.file_type] || '📄'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-black truncate group-hover:text-amber-500 transition-colors ${strong}`}>
                                                        {r.title}
                                                    </p>
                                                    <p className={`text-xs font-medium truncate ${muted}`}>
                                                        {r.subject}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded border border-black flex-shrink-0 font-bold uppercase shadow-sm ${
                                                r.file_type === 'pdf'  ? 'bg-rose-100 text-rose-900'    :
                                                r.file_type === 'pptx' ? 'bg-orange-100 text-orange-900' : 'bg-blue-100 text-blue-900'
                                            }`}>
                                                {r.file_type}
                                            </span>
                                        </div>

                                        <StarRating rating={r.average_rating} />
                                    </div>

                                    {/* Brutalist Card Footer */}
                                    <div className={`flex items-center justify-between pt-3 border-t-2 ${divider}`}>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-5 h-5 rounded-md border border-black bg-amber-300 text-black flex items-center justify-center text-[10px] font-black flex-shrink-0">
                                                {r.uploaded_by.charAt(0).toUpperCase()}
                                            </div>
                                            <span className={`text-[11px] font-bold truncate max-w-24 ${strong}`}>{r.uploaded_by}</span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`text-[10px] font-mono font-medium ${muted}`}>{r.created_at}</span>
                                            <span className="text-[10px] font-black px-1.5 py-0.2 rounded border border-black bg-black text-white">
                                                Sem {r.semester}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Bottom Assistant Action Area ── */}
                <div className="w-full rounded-2xl border-2 border-b-6 border-black bg-black text-white p-5 shadow-[4px_4px_0px_0px_#1a1a1a] relative overflow-hidden group">
                    <div className="absolute -right-6 -bottom-8 text-8xl opacity-10 pointer-events-none select-none transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12">🤖</div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-400 border-2 border-white rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0 transform transition-transform group-hover:scale-105 group-hover:rotate-3">
                                🤖
                            </div>
                            <div>
                                <h4 className="font-unique-bold text-lg tracking-wide text-amber-400">Try the AI Study Assistant</h4>
                                <p className="text-xs text-stone-300 mt-0.5 font-medium max-w-xl">
                                    Upload any assignment blueprint or document PDF to compile summaries and interactive self-evaluation metrics instantly.
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