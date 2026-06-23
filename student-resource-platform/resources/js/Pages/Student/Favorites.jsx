import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';

export default function Favorites({ auth, favorites }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const icons = { pdf: '📕', pptx: '📊', docx: '📝' };

    // Layout configuration variables matched to your environment theme 
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <MainLayout auth={auth}>
            <Head title="My Favorites" />

            <div className="mb-6 font-sans-custom">
                <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>My Favorites</h1>
                <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Resources you've saved to your local storage matrix</p>
            </div>

            {favorites.length === 0 ? (
                <div className={`border-2 border-dashed border-black rounded-3xl text-center py-16 font-sans-custom ${subCardBg}`}>
                    <p className="text-5xl mb-3">🤍</p>
                    <p className={`font-unique-bold text-lg uppercase tracking-wide ${textHeader}`}>No favorites saved</p>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mt-1 mb-6`}>
                        Browse resources and assign the retention flag to map them here.
                    </p>
                    <Link 
                        href="/student/browse" 
                        className="inline-block bg-blue-400 text-black border-2 border-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        Browse Directory
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans-custom">
                    {favorites.map((r) => (
                        <div key={r.id} className={`border-2 border-b-[8px] border-black rounded-3xl p-5 transition-all hover:translate-y-[-2px] flex flex-col gap-3 ${cardBg}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">{icons[r.file_type] || '📄'}</span>
                                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-2 border-black bg-stone-200 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                    {r.file_type}
                                </span>
                            </div>
                            
                            <div>
                                <h3 className={`font-unique-bold text-base uppercase leading-snug tracking-wide line-clamp-1 ${textHeader}`}>{r.title}</h3>
                                <p className={`text-[11px] font-black uppercase tracking-wider ${textMuted} mt-1`}>{r.subject} ✦ {r.semester}</p>
                                <p className="text-[10px] font-bold text-stone-400 mt-0.5">by {r.uploaded_by}</p>
                            </div>
                            
                            <div className="flex items-center justify-between gap-2 mt-auto pt-3 border-t-2 border-dashed border-black/20 dark:border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                                    ⭐ {r.average_rating > 0 ? Number(r.average_rating).toFixed(1) : 'Unrated Index'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => router.post(`/student/favorite/${r.id}`)}
                                        className="bg-red-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                    >
                                        ❤️ Remove
                                    </button>
                                    
                                    {/* FIXED: Replaced Inertia Link component with a standard HTML <a> tag for natural browser downloads */}
                                    <a
                                        href={`/student/download/${r.id}`}
                                        className="bg-blue-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl text-center transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                                    >
                                        Download
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}