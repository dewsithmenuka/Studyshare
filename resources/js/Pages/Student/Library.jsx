import { Head, router, usePage, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

export default function Library({ auth, resources, filters = {} }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const { props } = usePage();
    const flash = props.flash || {};
    const icons = { pdf: '📕', pptx: '📊', docx: '📝' };

    // Search and Filter States
    const [search, setSearch] = useState(filters.search || '');
    const [semester, setSemester] = useState(filters.semester || '');

    const handleFilter = () => {
        router.get('/student/library', { search, semester }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch('');
        setSemester('');
        router.get('/student/library');
    };

    // Design tokens
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const inputBg = dark ? 'bg-[#121110] border-[#2e2a24] text-white' : 'bg-[#fcf8f2] border-[#1a1a1a] text-black';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';
    const inputClass = `w-full border-2 border-black rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:ring-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${inputBg}`;

    const visibilityBadge = (visibility) => {
        if (visibility === 'public') return 'bg-emerald-400 text-black';
        if (visibility === 'pending') return 'bg-amber-400 text-black';
        return dark ? 'bg-stone-700 text-stone-200' : 'bg-stone-200 text-black';
    };

    const visibilityLabel = (visibility) => {
        if (visibility === 'public') return '✅ Public';
        if (visibility === 'pending') return '⏳ Pending';
        return '🔒 Private';
    };

    const handleShare = (id) => {
        if (confirm('Submit this file for public sharing? Admin will review it.')) {
            router.post('/student/share/' + id);
        }
    };

    const handleDelete = (id) => {
        if (confirm('Delete this file? This cannot be undone.')) {
            router.delete('/student/library/' + id);
        }
    };

    return (
        <MainLayout auth={auth}>
            <Head title="My Library" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 font-sans-custom">
                <div>
                    <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>My Library</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Your personal file collection — private by default</p>
                </div>
                <Link href="/student/upload" className="bg-emerald-400 text-black border-2 border-black text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none self-start sm:self-center">
                    + Upload File
                </Link>
            </div>

            {flash.success && (
                <div className="bg-emerald-400 text-black border-2 border-black rounded-xl p-4 mb-6 font-black text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 font-sans-custom">✅ <span>{flash.success}</span></div>
            )}
            {flash.error && (
                <div className="bg-red-400 text-black border-2 border-black rounded-xl p-4 mb-6 font-black text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 font-sans-custom">❌ <span>{flash.error}</span></div>
            )}

            {/* SEARCH AND FILTER BAR */}
            <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 mb-6 flex flex-wrap gap-4 items-end font-sans-custom ${cardBg}`}>
                <div className="flex-1 min-w-[200px]">
                    <label className={`text-[10px] font-black uppercase tracking-wider mb-1 block ${textMuted}`}>Search Documents</label>
                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleFilter()} placeholder="Search by name..." className={inputClass} />
                </div>
                <div className="w-48">
                    <label className={`text-[10px] font-black uppercase tracking-wider mb-1 block ${textMuted}`}>Filter Semester</label>
                    <select value={semester} onChange={e => setSemester(e.target.value)} className={inputClass}>
                        <option value="">All Semesters</option>
                        {[1, 2, 3, 4, 5, 6].map(s => <option key={s} value={`Semester ${s}`}>Semester {s}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleFilter} className="bg-blue-400 text-black border-2 border-black px-4 py-2 rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all">Search</button>
                    <button onClick={handleReset} className={`px-4 py-2 border-2 border-black rounded-xl text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all ${dark ? 'bg-stone-800 text-stone-300' : 'bg-white text-stone-700'}`}>Reset</button>
                </div>
            </div>

            {/* Legend / Info Bar */}
            <div className={`border-2 border-black rounded-2xl p-4 mb-6 flex flex-wrap gap-x-6 gap-y-3 font-sans-custom text-xs font-bold uppercase tracking-wider ${subCardBg}`}>
                <div className="flex items-center gap-2"><span className="bg-stone-300 text-black border border-black px-2 py-0.5 rounded text-[10px] font-black">🔒 Private</span><span className={textMuted}>Only you can see this</span></div>
                <div className="flex items-center gap-2"><span className="bg-amber-400 text-black border border-black px-2 py-0.5 rounded text-[10px] font-black">⏳ Pending</span><span className={textMuted}>Waiting for admin approval</span></div>
                <div className="flex items-center gap-2"><span className="bg-emerald-400 text-black border border-black px-2 py-0.5 rounded text-[10px] font-black">✅ Public</span><span className={textMuted}>Visible to all students</span></div>
            </div>

            {resources.length === 0 ? (
                <div className={`border-2 border-dashed border-black rounded-3xl text-center py-16 font-sans-custom ${subCardBg}`}>
                    <p className="text-5xl mb-3">📂</p>
                    <p className={`font-unique-bold text-lg uppercase tracking-wide ${textHeader}`}>Your library is empty</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans-custom">
                    {resources.map((r) => (
                        <div key={r.id} className={`border-2 border-b-[8px] border-black rounded-3xl p-5 transition-all hover:translate-y-[-2px] flex flex-col gap-3 ${cardBg}`}>
                            <div className="flex items-center justify-between">
                                <span className="text-3xl drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">{icons[r.file_type] || '📄'}</span>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${visibilityBadge(r.visibility)}`}>{visibilityLabel(r.visibility)}</span>
                            </div>
                            <div>
                                <h3 className={`font-unique-bold text-base uppercase leading-snug tracking-wide line-clamp-1 ${textHeader}`}>{r.title}</h3>
                                <p className={`text-[11px] font-black uppercase tracking-wider ${textMuted} mt-1`}>{r.subject} ✦ {r.semester}</p>
                            </div>
                            <div className="flex flex-col gap-3 mt-auto pt-3 border-t-2 border-dashed border-black/20 dark:border-white/10">
                                <div className="flex gap-2">
                                    <a href={`/student/download/${r.id}`} className="flex-1 bg-blue-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-widest py-2 rounded-xl text-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">Download</a>
                                    <button onClick={() => handleDelete(r.id)} className="bg-red-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">Delete</button>
                                </div>
                                {r.visibility === 'private' && (
                                    <button onClick={() => handleShare(r.id)} className={`w-full text-[10px] font-black uppercase tracking-wider py-2 rounded-xl border-2 border-dashed transition-all ${dark ? 'border-stone-600 text-stone-400 hover:border-emerald-500' : 'border-stone-400 text-stone-700 hover:border-black'}`}>🌐 Share to Public</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}