import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';

export default function Users({ auth, users }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    // Design layout tokens mapped to standard UI parameters
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110]' : 'bg-[#fcf8f2]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <MainLayout auth={auth}>
            <Head title="Manage Users" />

            {/* Header Block Frame */}
            <div className="mb-6 font-sans-custom">
                <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>Manage Users</h1>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>View and audit registered network identity nodes</p>
            </div>

            {/* Main Terminal Grid Table */}
            <div className={`border-2 border-b-[8px] border-black rounded-3xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${cardBg} font-sans-custom`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px] border-collapse">
                        <thead>
                            <tr className={`text-left border-b-2 border-black bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest ${dark ? 'text-stone-300' : 'text-stone-700'}`}>
                                <th className="px-5 py-4 border-r border-black/10">Ident Name</th>
                                <th className="px-5 py-4 border-r border-black/10">Email Route</th>
                                <th className="px-5 py-4 border-r border-black/10">Access Privilege</th>
                                <th className="px-5 py-4 border-r border-black/10">Sync Date</th>
                                <th className="px-5 py-4">Actions Matrix</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y-2 divide-black/10 ${subCardBg}`}>
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <p className="text-3xl mb-2 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">👥</p>
                                        <p className="text-xs font-black uppercase tracking-wider text-stone-400">No registered student identities verified in database cluster.</p>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((u) => {
                                    const isAdmin = u.roles[0]?.name === 'admin';
                                    return (
                                        <tr key={u.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors text-xs font-bold">
                                            {/* User Identity Name */}
                                            <td className={`px-5 py-4 border-r border-black/10 uppercase tracking-wide font-unique-bold ${textHeader}`}>
                                                {u.name}
                                            </td>

                                            {/* Email Routing Node */}
                                            <td className={`px-5 py-4 border-r border-black/10 lowercase tracking-tight ${dark ? 'text-stone-300' : 'text-stone-800'}`}>
                                                {u.email}
                                            </td>

                                            {/* Access Role Neo Badge */}
                                            <td className="px-5 py-4 border-r border-black/10">
                                                <span className={`border border-black px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black ${
                                                    isAdmin ? 'bg-purple-400' : 'bg-blue-400'
                                                }`}>
                                                    {u.roles[0]?.name || 'student'}
                                                </span>
                                            </td>

                                            {/* Database Creation Stamp */}
                                            <td className={`px-5 py-4 border-r border-black/10 tracking-widest text-[10px] uppercase ${textMuted}`}>
                                                {new Date(u.created_at).toLocaleDateString()}
                                            </td>

                                            {/* Action Control Trigger */}
                                            <td className="px-5 py-4">
                                                {!isAdmin ? (
                                                    <button
                                                        onClick={() => { if (confirm('Sever and purge this student node? Instruction cannot be inverted.')) router.delete(`/admin/users/${u.id}`); }}
                                                        className="bg-red-400 text-black border border-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                                                    >
                                                        Purge Node
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 opacity-60 px-1 select-none">
                                                        🔒 Restricted
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}