import { Head, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

export default function Contact({ auth, previousMessages }) {
    const { props } = usePage();
    const { theme } = useTheme();
    const dark = theme === 'dark';
    const flash = props.flash || {};

    const [form, setForm] = useState({
        name: auth?.user?.name || '',
        email: auth?.user?.email || '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [sending, setSending] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = 'Name is required.';
        else if (!/^[a-zA-Z\s]+$/.test(form.name)) newErrors.name = 'Name can only contain letters and spaces.';
        if (!form.email) newErrors.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Please enter a valid email.';
        if (!form.subject) newErrors.subject = 'Subject is required.';
        if (!form.message) newErrors.message = 'Message is required.';
        else if (form.message.length < 10) newErrors.message = 'Message must be at least 10 characters.';
        else if (form.message.length > 1000) newErrors.message = 'Message cannot exceed 1000 characters.';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setSending(true);
        router.post('/student/contact', form, {
            onSuccess: () => {
                setForm({ ...form, subject: '', message: '' });
                setErrors({});
            },
            onError: (e) => setErrors(e),
            onFinish: () => setSending(false),
        });
    };

    // Style design variables matched with the Neo-brutalist workspace UI
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const inputBg = dark ? 'bg-[#121110] border-[#2e2a24] text-white' : 'bg-[#fcf8f2] border-[#1a1a1a] text-black';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    const inputClass = `w-full border-2 border-black rounded-xl px-3 py-2.5 font-bold text-xs focus:outline-none focus:ring-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${inputBg}`;
    const labelClass = `text-[10px] font-black uppercase tracking-wider mb-1 block ${textMuted}`;
    const cardClass = `border-2 border-b-[8px] border-black rounded-3xl p-5 sm:p-6 mb-6 ${cardBg}`;

    return (
        <MainLayout auth={auth}>
            <Head title="Contact Admin" />

            <div className="max-w-2xl mx-auto font-sans-custom">
                <div className="mb-6">
                    <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>Contact Admin</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Direct message telemetry link to system administration</p>
                </div>

                {flash.success && (
                    <div className="bg-emerald-400 text-black border-2 border-black rounded-xl p-4 mb-6 font-black text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                        ✅ <span>{flash.success}</span>
                    </div>
                )}

                <div className={cardClass}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className={labelClass}>Your Identity String</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className={inputClass}
                                />
                                {errors.name && <p className="text-red-500 font-black text-[10px] uppercase mt-1">❌ {errors.name}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Email Destination Endpoint</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    className={inputClass}
                                />
                                {errors.email && <p className="text-red-500 font-black text-[10px] uppercase mt-1">❌ {errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Subject Category</label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                placeholder="e.g. Issue with file upload"
                                className={inputClass}
                            />
                            {errors.subject && <p className="text-red-500 font-black text-[10px] uppercase mt-1">❌ {errors.subject}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Message Core Content</label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm({ ...form, message: e.target.value })}
                                placeholder="Describe your issue or question in technical detail..."
                                rows={5}
                                className={inputClass}
                            />
                            <div className="flex justify-between items-center mt-1">
                                {errors.message ? (
                                    <p className="text-red-500 font-black text-[10px] uppercase">❌ {errors.message}</p>
                                ) : (
                                    <div />
                                )}
                                <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">{form.message.length}/1000 tokens</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={sending}
                            className="bg-blue-400 text-black font-black text-xs uppercase tracking-widest border-2 border-black py-3 px-6 rounded-xl transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                        >
                            {sending ? 'Transmitting System Packet...' : 'Transmit Message Bundle'}
                        </button>
                    </form>
                </div>

                {/* Previous messages logs */}
                {previousMessages.length > 0 && (
                    <div className="mt-8">
                        <h2 className={`font-unique-bold text-lg uppercase tracking-wide mb-4 ${textHeader}`}>Communication History Logs</h2>
                        <div className="flex flex-col gap-4">
                            {previousMessages.map((msg) => (
                                <div key={msg.id} className={`border-2 border-l-[8px] border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${msg.reply ? 'border-l-emerald-400' : 'border-l-amber-400'} ${cardBg}`}>
                                    <p className={`text-xs font-black uppercase tracking-wide ${textHeader}`}>📌 {msg.subject}</p>
                                    <p className={`text-xs font-medium leading-relaxed mt-1.5 opacity-90 ${dark ? 'text-stone-300' : 'text-stone-800'}`}>{msg.message}</p>
                                    <p className="text-[10px] font-bold text-stone-400 mt-2 tracking-wider">TIMESTAMP // {msg.created_at}</p>
                                    
                                    {msg.reply ? (
                                        <div className="mt-4 p-3 border-2 border-black rounded-xl bg-emerald-400 text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                                            <p className="text-[10px] font-black uppercase tracking-wider mb-1">✅ Admin Response Resolved — {msg.replied_at}</p>
                                            <p className="text-xs font-bold leading-normal">{msg.reply}</p>
                                        </div>
                                    ) : (
                                        <div className="mt-3 p-2 border-2 border-dashed border-black rounded-xl bg-amber-100 text-black">
                                            <p className="text-[10px] font-black uppercase tracking-wide">⏳ Pipeline State: Awaiting Admin Queue Dequeuing...</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className={`border-2 border-black rounded-2xl p-4 mt-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${dark ? 'bg-blue-950/30' : 'bg-blue-100'}`}>
                    <p className="text-[11px] font-black uppercase tracking-widest text-blue-500">📌 System Parameter Note</p>
                    <p className={`text-xs font-bold mt-0.5 ${dark ? 'text-blue-300' : 'text-blue-900'}`}>Administration response cycle typically executes within a 24-hour window.</p>
                </div>
            </div>
        </MainLayout>
    );
}