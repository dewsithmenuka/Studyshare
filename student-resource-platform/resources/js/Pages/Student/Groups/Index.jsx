import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';

export default function Index({ auth, myGroups }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    // Core layout theme tokens matched to configuration parameters
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <MainLayout auth={auth}>
            <Head title="My Study Groups" />

            {/* Core Header Section Dashboard Block */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 font-sans-custom">
                <div>
                    <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>Study Groups</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Collaborate and split source assets with directory peers</p>
                </div>
                <Link
                    href="/student/groups/create"
                    className="bg-blue-400 text-black border-2 border-black px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all w-fit"
                >
                    + Create Group Matrix
                </Link>
            </div>

            {myGroups.length === 0 ? (
                /* Empty Allocation Fallback Drawer */
                <div className={`border-2 border-b-[8px] border-dashed border-black rounded-3xl text-center py-16 px-4 max-w-xl mx-auto font-sans-custom ${cardBg}`}>
                    <p className="text-5xl mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">👥</p>
                    <p className={`text-base font-black uppercase tracking-wide ${textHeader}`}>No active group segments mapped</p>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mt-1 mb-6`}>Initialize a primary cluster configuration or receive access tokens from peers</p>
                    <Link
                        href="/student/groups/create"
                        className="bg-blue-400 text-black border-2 border-black px-5 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all inline-block"
                    >
                        Create a Group Node
                    </Link>
                </div>
            ) : (
                /* High-Contrast Node Grid Mapping Array */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans-custom">
                    {myGroups.map((group) => (
                        <div 
                            key={group.id} 
                            className={`border-2 border-b-[8px] border-black rounded-3xl p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all flex flex-col gap-4 ${cardBg}`}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-3xl drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">👥</span>
                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] text-black ${group.role === 'leader' ? 'bg-purple-400' : 'bg-blue-400'}`}>
                                    {group.role}
                                </span>
                            </div>
                            
                            <div>
                                <h3 className={`font-unique-bold text-base uppercase tracking-wide truncate ${textHeader}`}>{group.name}</h3>
                                {group.description && (
                                    <p className={`text-xs font-medium leading-relaxed line-clamp-2 mt-1 opacity-90 ${dark ? 'text-stone-300' : 'text-stone-800'}`}>{group.description}</p>
                                )}
                                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-3">
                                    👤 {group.member_count} nodes • Host // {group.created_by}
                                </p>
                            </div>
                            
                            <Link
                                href={`/student/groups/${group.id}`}
                                className="mt-auto bg-blue-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest text-center py-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                            >
                                Open Group Node →
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}