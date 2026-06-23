import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';

const icons = { pdf: '📕', pptx: '📊', docx: '📝' };

export default function MemberProfile({ auth, member, sharedGroups, resources }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    // Neo-brutalist style tokens matched with your application UI
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <MainLayout auth={auth}>
            <Head title={member.name + "'s Profile"} />

            {/* Back action tracking block */}
            <button 
                onClick={() => window.history.back()} 
                className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider border-2 border-black rounded-xl px-3 py-1.5 mb-5 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all ${dark ? 'bg-stone-800 text-stone-300' : 'bg-white text-black'}`}
            >
                ← Back
            </button>

            {/* Profile Overview Card */}
            <div className={`border-2 border-b-[8px] border-black rounded-3xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 font-sans-custom ${cardBg}`}>
                <div className="flex-shrink-0">
                    {member.avatar ? (
                        <img 
                            src={member.avatar} 
                            alt={member.name} 
                            className="w-24 h-24 rounded-2xl object-cover border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-blue-400 border-4 border-black flex items-center justify-center text-black text-4xl font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                
                <div className="text-center sm:text-left flex-1">
                    <h1 className={`font-unique-bold text-3xl uppercase tracking-tight ${textHeader}`}>{member.name}</h1>
                    {member.bio && <p className={`text-xs font-medium leading-relaxed max-w-md mt-1.5 opacity-90 ${dark ? 'text-stone-300' : 'text-stone-800'}`}>{member.bio}</p>}
                    <p className="text-[10px] font-black uppercase tracking-wider text-stone-400 mt-2">TIMESTAMP // Joined {member.joined}</p>
                    
                    {/* Metrics Array */}
                    <div className="flex gap-4 mt-4 justify-center sm:justify-start">
                        <div className={`border-2 border-black rounded-xl px-4 py-2 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-blue-400 text-black`}>
                            <p className="text-xl font-black leading-none">{resources.length}</p>
                            <p className="text-[9px] font-black uppercase tracking-wider mt-0.5">Resources</p>
                        </div>
                        <div className={`border-2 border-black rounded-xl px-4 py-2 text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-purple-400 text-black`}>
                            <p className="text-xl font-black leading-none">{sharedGroups.length}</p>
                            <p className="text-[9px] font-black uppercase tracking-wider mt-0.5">Shared Groups</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans-custom">
                {/* Left Side: Common Groups Context */}
                <div className="lg:col-span-1">
                    <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg}`}>
                        <h2 className={`font-unique-bold text-sm uppercase tracking-wide mb-4 ${textHeader}`}>👥 Groups in Common</h2>
                        
                        {sharedGroups.length === 0 ? (
                            <p className="text-xs font-bold uppercase tracking-wider text-stone-400">No cross-referenced group structures.</p>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {sharedGroups.map(g => (
                                    <Link 
                                        key={g.id} 
                                        href={`/student/groups/${g.id}`} 
                                        className={`flex items-center gap-3 p-2.5 border-2 border-black rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] transition-all ${subCardBg}`}
                                    >
                                        <div className="w-8 h-8 bg-purple-400 border-2 border-black rounded-lg flex items-center justify-center text-black text-xs font-black flex-shrink-0">
                                            {g.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`text-xs font-black uppercase tracking-wide truncate ${textHeader}`}>{g.name}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Uploaded Assets Index */}
                <div className="lg:col-span-2">
                    <div className={`border-2 border-b-[8px] border-black rounded-3xl p-5 ${cardBg}`}>
                        <h2 className={`font-unique-bold text-sm uppercase tracking-wide mb-4 ${textHeader}`}>📚 Uploaded Resources ({resources.length})</h2>
                        
                        {resources.length === 0 ? (
                            <div className={`border-2 border-dashed border-black rounded-2xl text-center py-10 ${subCardBg}`}>
                                <p className="text-4xl mb-2">📭</p>
                                <p className="text-xs font-black uppercase tracking-wider text-stone-400">No source assets uploaded yet.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {resources.map(r => (
                                    <div 
                                        key={r.id} 
                                        className={`flex items-center justify-between border-2 border-black rounded-2xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] gap-4 ${subCardBg}`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-2xl flex-shrink-0 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">{icons[r.file_type] || '📄'}</span>
                                            <div className="min-w-0">
                                                <p className={`text-xs font-black uppercase tracking-wide truncate ${textHeader}`}>{r.title}</p>
                                                <p className={`text-[10px] font-black uppercase tracking-wider ${textMuted} mt-0.5`}>{r.subject} ✦ {r.semester}</p>
                                                <p className="text-[9px] font-bold text-stone-400 mt-0.5">{r.uploaded}</p>
                                            </div>
                                        </div>
                                        
                                        <Link
                                            href={`/student/download/${r.id}`}
                                            as="a"
                                            className="bg-blue-400 text-black border-2 border-black text-xs font-black px-3.5 py-1.5 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex-shrink-0"
                                        >
                                            ↓ Download
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}