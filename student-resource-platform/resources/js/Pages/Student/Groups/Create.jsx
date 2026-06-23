import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

export default function Create({ auth }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const [form, setForm] = useState({ name: '', description: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!form.name) newErrors.name = 'Group validation failed: name is required.';
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setLoading(true);
        router.post('/student/groups', form, {
            onError: (e) => setErrors(e),
            onFinish: () => setLoading(false),
        });
    };

    // Design layout tokens aligned with core views
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    const inputClass = `w-full border-2 border-black rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none focus:bg-amber-50/10 transition-all ${
        dark ? 'bg-stone-800 text-white placeholder-stone-500' : 'bg-white text-black placeholder-stone-400'
    }`;
    const labelClass = `block text-[11px] font-black uppercase tracking-wider mb-1.5 ${textHeader}`;
    const cardClass = `border-2 border-b-[8px] border-black rounded-3xl p-6 ${cardBg}`;

    return (
        <MainLayout auth={auth}>
            <Head title="Create Study Group" />

            <div className="max-w-xl mx-auto font-sans-custom">
                <div className="mb-6">
                    <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>Create a Study Group</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Spin up a shared collective node and invite peers into the cluster</p>
                </div>

                <div className={cardClass}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className={labelClass}>Group Handle Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g. CS Year 2 Study Group"
                                className={inputClass}
                            />
                            {errors.name && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">⚠️ {errors.name}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Description Metadata (optional)</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="What is this group about?"
                                rows={3}
                                className={inputClass + ' normal-case'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest py-3.5 px-6 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Initializing Core Structure...' : 'Create Group Structure'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}