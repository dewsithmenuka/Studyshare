import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

export default function Resources({ auth, resources }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const [filter, setFilter] = useState('all');

    const filtered = resources.data.filter(r => {
        if (filter === 'pending') return r.visibility === 'pending';
        if (filter === 'public') return r.visibility === 'public';
        if (filter === 'private') return r.visibility === 'private';
        return true;
    });

    const pendingCount = resources.data.filter(r => r.visibility === 'pending').length;

    // Design layout tokens mapped to standard UI parameters
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110]' : 'bg-[#fcf8f2]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <MainLayout auth={auth}>
            <Head title="Manage Resources" />

            {/* Header Block Frame */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-sans-custom">
                <div>
                    <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>Manage Resources</h1>
                    {pendingCount > 0 && (
                        <p className="text-xs font-black uppercase tracking-widest mt-1">
                            <span className="bg-amber-400 text-black border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] animate-pulse">
                                ⏳ {pendingCount} pending public share request{pendingCount > 1 ? 's' : ''} unverified
                            </span>
                        </p>
                    )}
                </div>

                {/* Filter Matrix Controls */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'public', 'private'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 border-2 border-black rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${
                                filter === f 
                                    ? 'bg-blue-400 text-black' 
                                    : (dark ? 'bg-stone-800 text-stone-400 hover:text-white' : 'bg-white text-stone-600 hover:text-black')
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Terminal Table Shell */}
            <div className={`border-2 border-b-[8px] border-black rounded-3xl overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${cardBg} font-sans-custom`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px] border-collapse">
                        <thead>
                            <tr className={`text-left border-b-2 border-black bg-black/5 dark:bg-white/5 text-[11px] font-black uppercase tracking-widest ${dark ? 'text-stone-300' : 'text-stone-700'}`}>
                                <th className="px-5 py-4 border-r border-black/10">Title</th>
                                <th className="px-5 py-4 border-r border-black/10">Subject</th>
                                <th className="px-5 py-4 border-r border-black/10">Uploaded By</th>
                                <th className="px-5 py-4 border-r border-black/10">Type</th>
                                <th className="px-5 py-4 border-r border-black/10">Visibility</th>
                                <th className="px-5 py-4">Actions Matrix</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y-2 divide-black/10 ${subCardBg}`}>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12">
                                        <p className="text-3xl mb-2 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">🗄️</p>
                                        <p className="text-xs font-black uppercase tracking-wider text-stone-400">No isolated assets found matching criteria array.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((r) => (
                                    <tr key={r.id} className="hover:bg-black-[0.02] dark:hover:bg-white/[0.02] transition-colors text-xs font-bold">
                                        {/* Title Cell */}
                                        <td className={`px-5 py-4 border-r border-black/10 uppercase tracking-wide font-unique-bold ${textHeader}`}>
                                            {r.title}
                                        </td>
                                        
                                        {/* Subject Cell */}
                                        <td className={`px-5 py-4 border-r border-black/10 uppercase tracking-wide ${textMuted}`}>
                                            {r.subject}
                                        </td>
                                        
                                        {/* User Owner Cell */}
                                        <td className={`px-5 py-4 border-r border-black/10 tracking-tight ${dark ? 'text-stone-300' : 'text-stone-800'}`}>
                                            {r.user?.name || 'Unknown Node'}
                                        </td>
                                        
                                        {/* File Type Badge Cell */}
                                        <td className="px-5 py-4 border-r border-black/10">
                                            <span className="bg-purple-400 text-black border border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                                {r.file_type}
                                            </span>
                                        </td>
                                        
                                        {/* Visibility Neo Badge Cell */}
                                        <td className="px-5 py-4 border-r border-black/10">
                                            <span className={`border border-black px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-black ${
                                                r.visibility === 'public' ? 'bg-emerald-400' : r.visibility === 'pending' ? 'bg-amber-400' : 'bg-stone-300'
                                            }`}>
                                                {r.visibility}
                                            </span>
                                        </td>
                                        
                                        {/* Actions Command Cells */}
                                        <td className="px-5 py-4">
                                            <div className="flex gap-2 flex-wrap">
                                                {r.visibility === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => router.patch('/admin/resources/' + r.id + '/approve-public')}
                                                            className="bg-emerald-400 text-black border border-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                                                        >
                                                            Approve Public
                                                        </button>
                                                        <button
                                                            onClick={() => router.patch('/admin/resources/' + r.id + '/reject-public')}
                                                            className="bg-amber-400 text-black border border-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                                                        >
                                                            Deny Request
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => { if (confirm('Purge this binary resource? Action cannot be un-done.')) router.delete('/admin/resources/' + r.id); }}
                                                    className="bg-red-400 text-black border border-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                                                >
                                                    Purge
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
}