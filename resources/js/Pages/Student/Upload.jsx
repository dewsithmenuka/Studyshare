import { Head, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';
import { useState } from 'react';

export default function Upload({ auth, categories }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const [form, setForm] = useState({
        title: '', subject: '', semester: '', description: '', category_id: '', file: null,
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [uploading, setUploading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!form.title) newErrors.title = 'Title field must be populated.';
        else if (!/^[a-zA-Z0-9\s\-_]+$/.test(form.title)) newErrors.title = 'Title can only contain alphanumeric characters, spaces, hyphens and underscores.';
        if (!form.subject) newErrors.subject = 'Subject classification is required.';
        if (!form.semester) newErrors.semester = 'Semester index selection is required.';
        if (!form.file) newErrors.file = 'No file attached to upload stream.';
        else if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(form.file.type)) {
            newErrors.file = 'Invalid MIME type. Only PDF, DOCX, and PPTX types allowed.';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
        setUploading(true);
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v) data.append(k, v); });
        router.post('/student/upload', data, {
            onSuccess: () => { setSuccess(true); setForm({ title: '', subject: '', semester: '', description: '', category_id: '', file: null }); setErrors({}); },
            onError: (e) => setErrors(e),
            onFinish: () => setUploading(false),
        });
    };

    // Style configuration design tokens matched to system environment
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    const inputClass = `w-full border-2 border-black rounded-xl px-3 py-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none focus:bg-amber-50/10 transition-all ${
        dark ? 'bg-stone-800 text-white placeholder-stone-500' : 'bg-white text-black placeholder-stone-400'
    }`;
    const labelClass = `block text-[11px] font-black uppercase tracking-wider mb-1.5 ${textHeader}`;
    const cardClass = `border-2 border-b-[8px] border-black rounded-3xl p-6 ${cardBg}`;

    return (
        <MainLayout auth={auth}>
            <Head title="Upload Resource" />

            <div className="max-w-2xl mx-auto font-sans-custom">
                <div className="mb-6">
                    <h1 className={`font-unique-bold text-4xl uppercase tracking-tight ${textHeader}`}>Upload a Resource</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest ${textMuted} mt-1`}>✦ Push your notes or study materials into the shared collective directory</p>
                </div>

                {success && (
                    <div className="bg-emerald-400 text-black border-2 border-black rounded-xl p-4 mb-6 font-black text-xs uppercase tracking-wide shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                        ✅ <span>File uploaded successfully! Visible following index authorization verification.</span>
                    </div>
                )}

                <div className={cardClass}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div>
                            <label className={labelClass}>Title Block</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                                placeholder="e.g. Data Structures Lecture Notes"
                                className={inputClass}
                            />
                            {errors.title && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">⚠️ {errors.title}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Subject Domain Classification</label>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={e => setForm({ ...form, subject: e.target.value })}
                                placeholder="e.g. Computer Science"
                                className={inputClass}
                            />
                            {errors.subject && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">⚠️ {errors.subject}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Target Academic Term Semester</label>
                            <select
                                value={form.semester}
                                onChange={e => setForm({ ...form, semester: e.target.value })}
                                className={inputClass}
                            >
                                <option value="">Select semester</option>
                                {['Semester 1','Semester 2','Semester 3','Semester 4','Semester 5','Semester 6','Semester 7','Semester 8'].map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            {errors.semester && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">⚠️ {errors.semester}</p>}
                        </div>

                        {categories.length > 0 && (
                            <div>
                                <label className={labelClass}>Resource Category Flag (optional)</label>
                                <select
                                    value={form.category_id}
                                    onChange={e => setForm({ ...form, category_id: e.target.value })}
                                    className={inputClass}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className={labelClass}>Description Metadata Array (optional)</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                                placeholder="Briefly describe what this resource covers..."
                                rows={3}
                                className={inputClass + ' normal-case'}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>Binary File Target Payload</label>
                            <div className={`border-2 border-dashed border-black rounded-2xl p-6 text-center transition-all relative ${subCardBg}`}>
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.pptx"
                                    onChange={e => setForm({ ...form, file: e.target.files[0] })}
                                    className="hidden"
                                    id="file-input"
                                />
                                <label htmlFor="file-input" className="cursor-pointer block">
                                    <p className="text-4xl mb-2 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">📂</p>
                                    <p className={`text-xs font-black uppercase tracking-wide ${textHeader}`}>
                                        {form.file ? form.file.name : 'Select or drop asset payload'}
                                    </p>
                                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">PDF, DOCX, PPTX formats up to 10MB matrix allocation</p>
                                </label>
                            </div>
                            {errors.file && <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">⚠️ {errors.file}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-blue-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest py-3.5 px-6 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 mt-2"
                        >
                            {uploading ? 'Processing Stream Upload...' : 'Upload Resource to Nodes'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}