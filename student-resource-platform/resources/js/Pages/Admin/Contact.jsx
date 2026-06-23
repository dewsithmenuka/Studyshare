import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

export default function Contact({ auth, messages }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const unreadCount = messages.filter(m => m.status === 'unread').length;
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const handleReply = (msgId) => {
        if (!replyText.trim()) return;
        setSending(true);
        router.post('/admin/contact/' + msgId + '/reply', { reply: replyText }, {
            onSuccess: () => {
                setReplyingTo(null);
                setReplyText('');
            },
            onFinish: () => setSending(false),
        });
    };

    // Design layout tokens mapped to standard UI parameters
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <MainLayout auth={auth}>
            <Head title="Contact Messages" />

            {/* Header Area Workspace */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-sans-custom">
                <div>
                    <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>Contact Messages</h1>
                    <p className="text-xs font-bold uppercase tracking-widest mt-1">
                        {unreadCount > 0 ? (
                            <span className="bg-blue-400 text-black border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                {unreadCount} unread packet{unreadCount > 1 ? 's' : ''} pending
                            </span>
                        ) : (
                            <span className={`text-emerald-500 font-black ${textMuted}`}>✦ All log packages evaluated</span>
                        )}
                    </p>
                </div>
            </div>

            {messages.length === 0 ? (
                /* Empty Fallback State Card */
                <div className={`border-2 border-b-[8px] border-dashed border-black rounded-3xl text-center py-16 px-4 max-w-xl mx-auto font-sans-custom ${cardBg}`}>
                    <p className="text-5xl mb-4 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">📭</p>
                    <p className={`text-base font-black uppercase tracking-wide ${textHeader}`}>Data log empty</p>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mt-1`}>No incoming transmissions received at this node endpoint.</p>
                </div>
            ) : (
                /* Messages Stream Vector Array */
                <div className="flex flex-col gap-6 font-sans-custom">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`border-2 border-b-[8px] border-black rounded-3xl p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${cardBg} ${
                                msg.status === 'unread' ? 'border-l-[12px] border-l-blue-400' : ''
                            }`}
                        >
                            <div className="flex flex-col md:flex-row items-start justify-between gap-5">
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-2">
                                        <span className={`font-unique-bold text-sm uppercase tracking-wide ${textHeader}`}>{msg.name}</span>
                                        <span className="text-stone-400 text-xs hidden sm:inline">✦</span>
                                        <span className="text-xs font-bold text-stone-400 lowercase tracking-tight truncate">{msg.email}</span>
                                        
                                        {/* Brutalist Status Indicators */}
                                        {msg.status === 'unread' && (
                                            <span className="bg-blue-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">New</span>
                                        )}
                                        {msg.reply && (
                                            <span className="bg-purple-400 text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">Replied</span>
                                        )}
                                    </div>
                                    
                                    <p className={`text-xs font-black uppercase tracking-wide mb-2 ${dark ? 'text-stone-200' : 'text-stone-900'}`}>📌 {msg.subject}</p>
                                    <p className={`text-xs font-medium leading-relaxed normal-case ${dark ? 'text-stone-300' : 'text-stone-800'}`}>{msg.message}</p>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-3">Timestamp // {msg.created_at}</p>

                                    {/* System Reply Node Component */}
                                    {msg.reply && (
                                        <div className={`mt-4 border-2 border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${subCardBg}`}>
                                            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-500 mb-1.5">✅ Authorized Admin Loop Reply — {msg.replied_at}</p>
                                            <p className={`text-xs font-medium normal-case ${dark ? 'text-stone-300' : 'text-stone-800'}`}>{msg.reply}</p>
                                        </div>
                                    )}

                                    {/* Action Reply Input Subsystem */}
                                    {replyingTo === msg.id && (
                                        <div className="mt-4 pt-4 border-t-2 border-dashed border-black/20 dark:border-white/10">
                                            <textarea
                                                value={replyText}
                                                onChange={e => setReplyText(e.target.value)}
                                                placeholder="Inject administrative response sequence parameters..."
                                                rows={3}
                                                className={`w-full border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:bg-amber-50/10 transition-all ${
                                                    dark ? 'bg-stone-800 text-white placeholder-stone-500' : 'bg-white text-black placeholder-stone-400'
                                                }`}
                                            />
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleReply(msg.id)}
                                                    disabled={sending}
                                                    className="bg-emerald-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                                                >
                                                    {sending ? 'Broadcasting stream...' : 'Transmit Reply'}
                                                </button>
                                                <button
                                                    onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                                    className={`border-2 border-black text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all ${dark ? 'bg-stone-800 text-stone-300' : 'bg-white text-black'}`}
                                                >
                                                    Abort
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Controls Matrix Column */}
                                <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto flex-wrap md:flex-nowrap border-t-2 md:border-t-0 md:border-l-2 border-dashed border-black/20 dark:border-white/10 pt-3 md:pt-0 md:pl-4">
                                    <button
                                        onClick={() => { setReplyingTo(msg.id); setReplyText(msg.reply || ''); }}
                                        className="flex-1 md:flex-initial bg-blue-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap text-center"
                                    >
                                        {msg.reply ? 'Modify Response' : 'Draft Response'}
                                    </button>
                                    {msg.status === 'unread' && (
                                        <button
                                            onClick={() => router.patch('/admin/contact/' + msg.id + '/read')}
                                            className={`flex-1 md:flex-initial border-2 border-black text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap text-center ${dark ? 'bg-stone-800 text-stone-300' : 'bg-white text-black'}`}
                                        >
                                            Commit Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { if (confirm('Purge this contact packet entity?')) router.delete('/admin/contact/' + msg.id); }}
                                        className="flex-1 md:flex-initial bg-red-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all text-center"
                                    >
                                        Purge
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    );
}