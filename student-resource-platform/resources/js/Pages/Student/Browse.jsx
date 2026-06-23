import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';

export default function Browse({ auth, resources, categories, filters }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const [search, setSearch]     = useState(filters.search || '');
    const [subject, setSubject]   = useState(filters.subject || '');
    const [semester, setSemester] = useState(filters.semester || '');

    const handleFilter = () => {
        router.get('/student/browse', { search, subject, semester }, { preserveState: true });
    };

    const handleReset = () => {
        setSearch(''); setSubject(''); setSemester('');
        router.get('/student/browse');
    };

    // Design layout configurations matching the neo-brutalist theme structure
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const inputBg = dark ? 'bg-[#121110] border-[#2e2a24] text-white' : 'bg-[#fcf8f2] border-[#1a1a1a] text-black';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    const inputClass = `w-full border-2 border-black rounded-xl px-3 py-2 font-bold text-xs focus:outline-none focus:ring-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${inputBg}`;
    const labelClass = `text-[10px] font-black uppercase tracking-wider mb-1 block ${textMuted}`;

    return (
        <MainLayout auth={auth}>
            <Head title="Browse Resources" />

            <div className="mb-6 font-sans-custom">
                <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>Browse Resources</h1>
                <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Find notes, past papers and study materials</p>
            </div>

            {/* Filters */}
            <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 mb-6 flex flex-wrap gap-4 items-end font-sans-custom ${cardBg}`}>
                <div className="flex-1 min-w-[200px]">
                    <label className={labelClass}>Search Matrix</label>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleFilter()}
                        placeholder="Search by title or subject..."
                        className={inputClass}
                    />
                </div>
                <div className="min-w-[150px]">
                    <label className={labelClass}>Subject Category</label>
                    <input
                        type="text"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="e.g. Mathematics"
                        className={inputClass}
                    />
                </div>
                <div className="min-w-[150px]">
                    <label className={labelClass}>Target Semester</label>
                    <select
                        value={semester}
                        onChange={e => setSemester(e.target.value)}
                        className={inputClass}
                    >
                        <option value="">All Semesters</option>
                        {['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6'].map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                        onClick={handleFilter} 
                        className="flex-1 sm:flex-initial bg-emerald-400 text-black border-2 border-black px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        Search
                    </button>
                    <button 
                        onClick={handleReset} 
                        className={`px-4 py-2 border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all ${dark ? 'bg-stone-800 text-stone-300' : 'bg-white text-stone-700'}`}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            {resources.data.length === 0 ? (
                <div className={`border-2 border-dashed border-black rounded-3xl text-center py-16 font-sans-custom ${subCardBg}`}>
                    <p className="text-5xl mb-3">📭</p>
                    <p className={`font-unique-bold text-lg uppercase tracking-wide ${textHeader}`}>No resources found</p>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mt-1`}>Try a different query or initialize a new upload string.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans-custom">
                    {resources.data.map((r) => (
                        <ResourceCard key={r.id} resource={r} dark={dark} cardBg={cardBg} subCardBg={subCardBg} inputBg={inputBg} textMuted={textMuted} textHeader={textHeader} />
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {resources.links && (
                <div className="flex justify-center flex-wrap gap-2 mt-8 font-sans-custom">
                    {resources.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.get(link.url)}
                            disabled={!link.url}
                            className={`px-3 py-1.5 border-2 border-black rounded-lg text-xs font-black uppercase tracking-wide transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${
                                link.active
                                    ? 'bg-blue-400 text-black'
                                    : dark
                                        ? 'bg-stone-800 text-stone-300'
                                        : 'bg-white text-stone-700'
                            } disabled:opacity-40`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </MainLayout>
    );
}

function StarRating({ resourceId, currentRating }) {
    const [rating, setRating] = useState(currentRating || 0);
    const [hover, setHover]   = useState(0);

    // Sync state whenever currentRating updates from backend payload parameters
    useEffect(() => {
        if (currentRating !== undefined) {
            setRating(currentRating);
        }
    }, [currentRating]);

    const handleRate = (score) => {
        setRating(score);
        router.post(`/student/rate/${resourceId}`, { score }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition transform active:scale-95 text-xl"
                >
                    <span className={hover >= star || rating >= star ? 'text-amber-400 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]' : 'text-stone-300 dark:text-stone-700'}>★</span>
                </button>
            ))}
        </div>
    );
}

function ResourceCard({ resource, dark, cardBg, subCardBg, inputBg, textMuted, textHeader }) {
    const icons = { pdf: '📕', pptx: '📊', docx: '📝' };

    const handleFavorite = () => {
        router.post(`/student/favorite/${resource.id}`, {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 transition-all hover:translate-y-[-2px] flex flex-col gap-3 ${cardBg}`}>
            <div className="flex items-center justify-between">
                <span className="text-3xl drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">{icons[resource.file_type] || '📄'}</span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg border-2 border-black bg-stone-200 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    {resource.file_type}
                </span>
            </div>
            
            <div>
                <h3 className={`font-unique-bold text-base uppercase leading-snug tracking-wide line-clamp-1 ${textHeader}`}>{resource.title}</h3>
                <p className={`text-[11px] font-black uppercase tracking-wider ${textMuted} mt-1`}>{resource.subject} ✦ {resource.semester}</p>
                <p className="text-[10px] font-bold text-stone-400 mt-0.5">by {resource.uploaded_by} • {resource.created_at}</p>
            </div>

            {resource.description && (
                <p className={`text-xs font-medium leading-normal line-clamp-2 opacity-80 ${dark ? 'text-stone-300' : 'text-stone-700'}`}>{resource.description}</p>
            )}

            <div className={`flex flex-col gap-3 mt-auto pt-3 border-t-2 border-dashed border-black/20 dark:border-white/10`}>
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">
                        {resource.average_rating > 0 ? `⭐ ${Number(resource.average_rating).toFixed(1)}` : 'Unrated Index'}
                    </span>
                    <StarRating resourceId={resource.id} currentRating={resource.user_rating} />
                </div>
                
                <div className="flex items-center justify-between gap-2">
                    <button
                        onClick={handleFavorite}
                        className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 border-2 border-black rounded-xl transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${
                            resource.is_favorited
                                ? 'bg-red-400 text-black'
                                : dark
                                    ? 'bg-stone-800 text-stone-400'
                                    : 'bg-white text-stone-600'
                        }`}
                    >
                        {resource.is_favorited ? '❤️ Saved' : '🤍 Save'}
                    </button>
                    {/* Altered component to standard native anchor node for uninhibited browser download handling */}
                    <a
                        href={`/student/download/${resource.id}`}
                        className="bg-blue-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl text-center transition-all shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none"
                    >
                        Download
                    </a>
                </div>
            </div>
        </div>
    );
}