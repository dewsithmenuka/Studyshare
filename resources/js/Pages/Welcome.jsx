import { Link } from '@inertiajs/react';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';

export default function Welcome() {
    const { theme, toggleTheme } = useTheme();
    const dark = theme === 'dark';
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Theme-based style variables
    const baseBg = dark ? 'bg-[#121110]' : 'bg-[#fcf8f2]';
    const textStrong = dark ? 'text-stone-100' : 'text-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const navBg = scrolled ? (dark ? 'bg-[#121110]/90 backdrop-blur-md border-b-2 border-black' : 'bg-[#fcf8f2]/90 backdrop-blur-md border-b-2 border-black') : 'bg-transparent';

    return (
        <div className={`min-h-screen transition-colors duration-300 font-sans-custom ${baseBg} ${textStrong}`}>
            
            {/* Custom Google Fonts & Animations */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                
                /* Updated to match the ultra-condensed heavy rounded layout style */
                .font-unique-bold { 
                    font-family: 'Big Shoulders Display', sans-serif; 
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                }
                
                .font-sans-custom { font-family: 'Plus Jakarta Sans', sans-serif; }
                .neo-border { border: 2px solid #1a1a1a; box-shadow: 4px 4px 0px 0px #1a1a1a; }
                .neo-border-sm { border: 2px solid #1a1a1a; box-shadow: 2px 2px 0px 0px #1a1a1a; }
                .neo-btn { transition: all 0.2s; }
                .neo-btn:active { transform: translate(2px, 2px); box-shadow: 0px 0px 0px 0px #1a1a1a; }
            `}</style>

            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-amber-400 border-2 border-black rounded-xl flex items-center justify-center text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            📚
                        </div>
                        <span className="font-unique-bold text-3xl tracking-tight">StudyShare</span>
                    </div>


                    <div className="flex items-center gap-4">
                        <button onClick={toggleTheme} className="p-2 rounded-lg border-2 border-black bg-white dark:bg-stone-800 neo-btn">
                            {dark ? '☀️' : '🌙'}
                        </button>
                        <Link href="/login" className={`hidden sm:block font-bold text-sm ${textStrong}`}>Login</Link>
                        <Link href="/register" className="bg-black text-white px-5 py-2.5 rounded-xl font-bold text-sm border-2 border-black neo-border-sm neo-btn">
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className={`max-w-7xl mx-auto rounded-[3rem] p-8 md:p-16 relative overflow-hidden border-2 border-b-[12px] border-black ${cardBg}`}>
                    
                    {/* Decorative Hand-drawn SVG Accents */}
                    <div className="absolute right-10 top-10 opacity-20 pointer-events-none hidden lg:block">
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M10 50 Q 25 10 50 50 T 90 50" strokeDasharray="5 5" />
                            <path d="M50 10 L 55 25 L 70 30 L 55 35 L 50 50 L 45 35 L 30 30 L 45 25 Z" fill="currentColor" />
                        </svg>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                        <div className="flex-1 space-y-8 text-center lg:text-left">
                            <h1 className="font-unique-bold text-6xl md:text-8xl leading-[0.85] tracking-tight">
                                Learning with <br />
                                <span className="text-amber-500">StudyShare</span>
                            </h1>

                            <p className={`text-lg md:text-xl max-w-xl font-medium leading-relaxed ${textMuted}`}>
                                Take advantage of our platform with more than 50,000+ notes and professional resources to advance your academic career.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
                                <div className="relative flex-1">
                                </div>
                            </div>
                            
                            <p className="text-xs font-bold uppercase tracking-widest opacity-60">✦ 50k+ reviews with 5-star rating</p>
                        </div>

                        {/* Graphic Composition from Diagram */}
                        <div className="flex-1 flex justify-center items-end gap-4">
                            {/* Main Arch Frame */}
                            <div className="relative w-64 h-80 bg-purple-500 rounded-t-full border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-white/20 backdrop-blur-sm border-t-2 border-black p-4 text-center">
                                    <div className="bg-yellow-300 border-2 border-black px-2 py-1 rounded-lg text-[10px] font-black mb-2 inline-block shadow-sm">
                                        ⭐ 98.36% SUCCESS
                                    </div>
                                    <p className="text-white text-xs font-bold">32k+ reviews with 5 star rating</p>
                                </div>
                                <div className="absolute top-10 left-1/2 -translate-x-1/2 text-7xl">👩‍🎓</div>
                            </div>
                            
                            {/* Secondary Smaller Arch */}
                            <div className="relative w-40 h-56 bg-rose-400 rounded-t-full border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center p-4 text-center hidden md:flex">
                                <span className="text-5xl mb-2 font-unique-bold text-black">99%</span>
                                <p className="text-[10px] font-black leading-tight uppercase">Students success from our online library</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Statistics - Neo-Brutalist Cards */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="font-unique-bold text-5xl text-center mb-16 underline decoration-amber-400 decoration-8 underline-offset-4">
                        Why students choose us
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Resource Sharing', icon: '📁', color: 'bg-blue-400', desc: 'Upload and discover notes, past papers, and study materials.' },
                            { title: 'Study Groups', icon: '👥', color: 'bg-purple-400', desc: 'Create or join study groups, add friends, and collaborate.' },
                            { title: 'Smart Search', icon: '🔍', color: 'bg-emerald-400', desc: 'Filter by subject or semester to find exactly what you need.' },
                        ].map((card) => (
                            <div key={card.title} className={`p-8 rounded-[2rem] border-2 border-b-8 border-black ${cardBg} neo-btn`}>
                                <div className={`w-16 h-16 ${card.color} border-2 border-black rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                                    {card.icon}
                                </div>
                                <h3 className="font-unique-bold text-3xl mb-3">{card.title}</h3>
                                <p className={`font-medium ${textMuted}`}>{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Step-by-Step Flow */}
            <section className={`py-24 border-t-4 border-black ${dark ? 'bg-stone-900' : 'bg-amber-50'}`}>
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <span className="bg-black text-white px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 inline-block">Workflow</span>
                    <h2 className="font-unique-bold text-5xl md:text-6xl mb-16">Ace exams in 3 steps</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {[
                            { step: '01', title: 'Create Profile', icon: '👤' },
                            { step: '02', title: 'Share & Browse', icon: '📤' },
                            { step: '03', title: 'Learn Together', icon: '🎓' },
                        ].map((item) => (
                            <div key={item.step} className="group">
                                <div className="w-24 h-24 mx-auto rounded-full border-2 border-black bg-white flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-amber-400 transition-colors">
                                    {item.icon}
                                </div>
                                <div className="mt-6">
                                    <span className="text-amber-600 font-black text-sm">{item.step}</span>
                                    <h3 className="font-unique-bold text-2xl mt-1">{item.title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className={`py-12 border-t-4 border-black ${dark ? 'bg-black' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">📚</span>
                        <span className="font-unique-bold text-3xl">StudyShare</span>
                    </div>
                    
                    <div className="flex gap-8 text-sm font-bold">
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                        <a href="#">Contacts</a>
                    </div>

                    <p className="text-xs font-bold opacity-50">© 2026 StudyShare. Built for students.</p>
                </div>
            </footer>
        </div>
    );
}