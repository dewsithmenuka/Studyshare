import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';

export default function Dashboard({ auth, stats, resourcesByType, resourcesBySubject, userGrowth, topUploaders, recentResources, pending_resources }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const baseBg      = dark ? 'bg-[#121110]' : 'bg-[#fcf8f2]';
    const surface     = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const cardBg      = dark ? 'bg-[#262320] border-[#3b352e]' : 'bg-white border-[#1a1a1a]';
    const strong      = dark ? 'text-stone-100' : 'text-[#1a1a1a];';
    const muted       = dark ? 'text-stone-400' : 'text-stone-600';
    const divider     = dark ? 'border-[#2e2a24]' : 'border-[#1a1a1a]';

    const statCards = [
        { label: 'Total Users', value: stats.total_users, icon: '👥', color: 'bg-blue-400' },
        { label: 'Total Resources', value: stats.total_resources, icon: '📁', color: 'bg-purple-400' },
        { label: 'Pending Approval', value: stats.pending, icon: '⏳', color: 'bg-amber-400' },
        { label: 'Public Resources', value: stats.approved, icon: '✅', color: 'bg-emerald-400' },
        { label: 'Study Groups', value: stats.total_groups, icon: '👥', color: 'bg-cyan-400' },
        { label: 'Chat Messages', value: stats.total_messages, icon: '💬', color: 'bg-indigo-400' },
        { label: 'Unread Contacts', value: stats.unread_contacts, icon: '✉️', color: 'bg-rose-400' },
        { label: 'Private Files', value: stats.private_files, icon: '🔒', color: 'bg-stone-400' },
    ];

    const maxSubject = Math.max(...(resourcesBySubject?.map(r => r.count) || [1]));
    const maxUploader = Math.max(...(topUploaders?.map(u => u.count) || [1]));

    return (
        <MainLayout auth={auth}>
            <Head title="Admin Dashboard — StudyShare" />

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

                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(2deg); }
                }
                .animate-float { animation: float-slow 4s ease-in-out infinite; }
            `}</style>

            <div className={`space-y-6 font-sans-custom p-2 sm:p-4 ${baseBg} transition-colors duration-300 min-h-screen`}>

                {/* ── Title Banner Segment ── */}
                <div className={`rounded-3xl p-6 sm:p-8 border-2 border-b-[10px] border-black text-left relative overflow-hidden ${surface} neo-shadow-lg`}>
                    <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    
                    <div className="flex flex-col md:flex-row items-stretch justify-between gap-6 relative z-10">
                        <div className="flex-1 flex flex-col justify-center space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border-2 border-black bg-purple-300 text-black font-mono font-bold text-xs uppercase tracking-wider w-fit shadow-sm">
                                🛡️ Admin Command Deck
                            </div>
                            <h1 className={`font-unique-bold text-5xl sm:text-7xl tracking-tight leading-none ${strong}`}>
                                Platform <span className="text-amber-500 underline decoration-4 underline-offset-1">Overview</span>
                            </h1>
                            <p className={`text-sm sm:text-base font-medium ${muted}`}>
                                Monitor core matrix stats, approve queued community assets, and manage user analytics.
                            </p>
                        </div>

                        <div className="hidden md:flex items-center justify-end w-48 relative">
                            <div className="w-full h-28 bg-amber-400 rounded-2xl border-2 border-b-6 border-black flex flex-col justify-center items-center p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-3deg] animate-float">
                                <span className="text-3xl mb-1">📊</span>
                                <h3 className="font-unique-bold text-xl text-black tracking-tight">System Live</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {statCards.map((stat) => (
                        <div key={stat.label} className={`rounded-2xl p-4 border-2 border-b-6 border-black ${cardBg} flex items-center gap-4 shadow-[3px_3px_0px_0px_#1a1a1a] neo-card-hover transition-all`}>
                            <div className={`w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center text-2xl flex-shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className={`text-xs font-bold uppercase tracking-wider truncate ${muted}`}>{stat.label}</p>
                                <p className={`font-unique-bold text-3xl tracking-tight mt-0.5 ${strong}`}>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Middle Metrics Blocks ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Resources by Type */}
                    <div className={`rounded-2xl p-5 border-2 border-b-6 border-black ${cardBg} shadow-[3px_3px_0px_0px_#1a1a1a]`}>
                        <div className="mb-4">
                            <h2 className={`font-unique-bold text-2xl tracking-tight ${strong}`}>📊 Resources by File Type</h2>
                            <div className={`h-0.5 w-full mt-1 border-t-2 border-dashed ${divider}`} />
                        </div>
                        <div className="flex flex-col gap-4">
                            {resourcesByType?.map((r) => (
                                <div key={r.type} className="flex items-center gap-3">
                                    <span className={`text-xs font-mono font-bold w-12 border-2 border-black bg-stone-100 dark:bg-stone-800 text-center py-0.5 rounded px-1 capitalize shadow-sm ${strong}`}>{r.type}</span>
                                    <div className="flex-1 h-7 rounded-xl overflow-hidden border-2 border-black bg-stone-100 dark:bg-stone-900 shadow-sm relative">
                                        <div
                                            className="h-full bg-blue-400 border-r-2 border-black flex items-center px-2 transition-all duration-500"
                                            style={{ width: Math.max((r.count / (stats.total_resources || 1)) * 100, 5) + '%' }}
                                        >
                                            <span className="text-black text-xs font-black">{r.count}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!resourcesByType || resourcesByType.length === 0) && (
                                <p className={`text-xs font-medium py-4 text-center ${muted}`}>No resource types mapped yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Top Subjects */}
                    <div className={`rounded-2xl p-5 border-2 border-b-6 border-black ${cardBg} shadow-[3px_3px_0px_0px_#1a1a1a]`}>
                        <div className="mb-4">
                            <h2 className={`font-unique-bold text-2xl tracking-tight ${strong}`}>📚 Top Subjects</h2>
                            <div className={`h-0.5 w-full mt-1 border-t-2 border-dashed ${divider}`} />
                        </div>
                        <div className="flex flex-col gap-3">
                            {resourcesBySubject?.map((r, i) => (
                                <div key={r.subject} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded border-2 border-black bg-purple-300 text-black flex items-center justify-center text-xs font-black shadow-sm flex-shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className={`text-xs font-bold flex-1 truncate ${strong}`}>{r.subject}</span>
                                    <div className="w-28 h-4 rounded-lg border-2 border-black bg-stone-100 dark:bg-stone-900 overflow-hidden shadow-sm">
                                        <div
                                            className="h-full bg-purple-400 border-r border-black transition-all duration-500"
                                            style={{ width: (r.count / maxSubject) * 100 + '%' }}
                                        />
                                    </div>
                                    <span className={`text-xs font-mono font-black w-6 text-right ${strong}`}>{r.count}</span>
                                </div>
                            ))}
                            {(!resourcesBySubject || resourcesBySubject.length === 0) && (
                                <p className={`text-xs font-medium py-4 text-center ${muted}`}>No cataloged items yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Top Uploaders */}
                    <div className={`rounded-2xl p-5 border-2 border-b-6 border-black ${cardBg} shadow-[3px_3px_0px_0px_#1a1a1a]`}>
                        <div className="mb-4">
                            <h2 className={`font-unique-bold text-2xl tracking-tight ${strong}`}>🏆 Top Contributors</h2>
                            <div className={`h-0.5 w-full mt-1 border-t-2 border-dashed ${divider}`} />
                        </div>
                        <div className="flex flex-col gap-3">
                            {topUploaders?.map((u, i) => (
                                <div key={u.name} className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-xl border-2 border-black flex items-center justify-center text-black text-xs font-black flex-shrink-0 shadow-sm ${
                                        ['bg-yellow-400', 'bg-stone-300', 'bg-orange-400', 'bg-blue-400', 'bg-purple-400'][i] || 'bg-stone-200'
                                    }`}>
                                        {i + 1}
                                    </div>
                                    <span className={`text-xs font-bold flex-1 truncate ${strong}`}>{u.name}</span>
                                    <div className="w-28 h-4 rounded-lg border-2 border-black bg-stone-100 dark:bg-stone-900 overflow-hidden shadow-sm">
                                        <div
                                            className="h-full bg-emerald-400 border-r border-black transition-all duration-500"
                                            style={{ width: (u.count / maxUploader) * 100 + '%' }}
                                        />
                                    </div>
                                    <span className={`text-xs font-mono font-black w-6 text-right ${strong}`}>{u.count}</span>
                                </div>
                            ))}
                            {(!topUploaders || topUploaders.length === 0) && (
                                <p className={`text-xs font-medium py-4 text-center ${muted}`}>No active upload metrics yet.</p>
                            )}
                        </div>
                    </div>

                    {/* User Growth Chart Box */}
                    <div className={`rounded-2xl p-5 border-2 border-b-6 border-black ${cardBg} shadow-[3px_3px_0px_0px_#1a1a1a]`}>
                        <div className="mb-4">
                            <h2 className={`font-unique-bold text-2xl tracking-tight ${strong}`}>📈 User Inflow Matrix</h2>
                            <div className={`h-0.5 w-full mt-1 border-t-2 border-dashed ${divider}`} />
                        </div>
                        {userGrowth && userGrowth.length > 0 ? (
                            <div className="flex items-end gap-3 h-36 pt-4 px-2">
                                {userGrowth.map((g) => {
                                    const maxCount = Math.max(...userGrowth.map(x => x.count));
                                    const height = Math.max((g.count / maxCount) * 100, 8);
                                    return (
                                        <div key={g.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                                            <span className="text-[10px] font-mono font-black opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-1 rounded mb-0.5">
                                                {g.count}
                                            </span>
                                            <div
                                                className="w-full bg-cyan-400 border-2 border-black rounded-t-lg shadow-sm transition-all duration-500 hover:bg-amber-400"
                                                style={{ height: height + '%' }}
                                            />
                                            <span className={`text-[10px] font-mono font-bold uppercase truncate max-w-full ${muted}`}>
                                                {g.month.split(' ')[0]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className={`text-xs font-medium py-4 text-center ${muted}`}>No growth analytics stored.</p>
                        )}
                    </div>
                </div>

                {/* ── Sub-level Action Content Blocks ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Recent Uploads Feed */}
                    <div className={`rounded-2xl p-5 border-2 border-b-6 border-black ${cardBg} shadow-[3px_3px_0px_0px_#1a1a1a]`}>
                        <div className="mb-4">
                            <h2 className={`font-unique-bold text-2xl tracking-tight ${strong}`}>🕐 Logs: Recent Syncs</h2>
                            <div className={`h-0.5 w-full mt-1 border-t-2 border-dashed ${divider}`} />
                        </div>
                        <div className="flex flex-col gap-2.5">
                            {recentResources?.map((r, i) => (
                                <div key={i} className={`flex items-center gap-3 p-2.5 border-2 border-black rounded-xl bg-stone-50 dark:bg-[#1a1a1a] shadow-sm hover:bg-amber-50/20 transition-colors`}>
                                    <span className="text-xl flex-shrink-0">
                                        {r.file_type === 'pdf' ? '📕' : r.file_type === 'pptx' ? '📊' : '📝'}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-black truncate ${strong}`}>{r.title}</p>
                                        <p className={`text-[11px] mt-0.5 ${muted}`}>by {r.user} • {r.created_at}</p>
                                    </div>
                                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border border-black shadow-sm uppercase tracking-wide flex-shrink-0 ${
                                        r.visibility === 'public'   ? 'bg-emerald-200 text-stone-900' : 
                                        r.visibility === 'pending'  ? 'bg-amber-200 text-stone-900'   : 'bg-stone-300 text-stone-800'
                                    }`}>
                                        {r.visibility}
                                    </span>
                                </div>
                            ))}
                            {(!recentResources || recentResources.length === 0) && (
                                <p className={`text-xs font-medium py-4 text-center ${muted}`}>No asset files uploaded natively.</p>
                            )}
                        </div>
                    </div>

                    {/* Pending Gatekeeper Approvals */}
                    <div className={`rounded-2xl p-5 border-2 border-b-6 border-black ${cardBg} shadow-[3px_3px_0px_0px_#1a1a1a]`}>
                        <div className="mb-4">
                            <h2 className={`font-unique-bold text-2xl tracking-tight ${strong}`}>⏳ Moderation Pipeline</h2>
                            <div className={`h-0.5 w-full mt-1 border-t-2 border-dashed ${divider}`} />
                        </div>
                        
                        {pending_resources.length === 0 ? (
                            <div className="text-center py-10 relative overflow-hidden">
                                <div className="text-4xl animate-float inline-block mb-2">🎉</div>
                                <h4 className={`text-sm font-black ${strong}`}>Pipeline Clear!</h4>
                                <p className={`text-xs ${muted} mt-0.5`}>All incoming shared network files stand verified.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2.5">
                                {pending_resources.map((r) => (
                                    <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border-2 border-black rounded-xl bg-stone-50 dark:bg-[#1a1a1a] shadow-sm gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className={`text-xs font-black truncate ${strong}`}>{r.title}</p>
                                            <p className={`text-[11px] mt-0.5 ${muted}`}>Sender Node: {r.user?.name}</p>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button
                                                onClick={() => router.patch('/admin/resources/' + r.id + '/approve-public')}
                                                className="bg-emerald-400 hover:bg-emerald-300 text-black text-[11px] font-black px-3 py-1.5 rounded-lg border-2 border-black shadow-sm neo-interactive transition-all"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => router.patch('/admin/resources/' + r.id + '/reject-public')}
                                                className="bg-rose-400 hover:bg-rose-300 text-black text-[11px] font-black px-3 py-1.5 rounded-lg border-2 border-black shadow-sm neo-interactive transition-all"
                                            >
                                                Reject
                                            </button>
                                        </div>
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