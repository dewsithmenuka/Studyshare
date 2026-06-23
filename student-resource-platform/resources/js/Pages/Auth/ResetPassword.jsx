import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { useTheme } from '@/hooks/useTheme';

export default function ResetPassword({ token, email }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Design layout tokens mapped to standard UI parameters
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    const inputClass = `w-full border-2 border-black rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none focus:bg-amber-50/10 transition-all ${
        dark ? 'bg-stone-800 text-white placeholder-stone-500' : 'bg-white text-black placeholder-stone-400'
    }`;
    const labelClass = `block text-[11px] font-black uppercase tracking-wider mb-1.5 ${textHeader}`;

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            {/* Brutalist Reset Box Framework */}
            <div className={`max-w-md mx-auto border-2 border-b-[8px] border-black rounded-3xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-sans-custom ${cardBg}`}>
                
                {/* Header Context Banner */}
                <div className="mb-6 text-center">
                    <h1 className={`font-unique-bold text-3xl uppercase tracking-tight ${textHeader}`}>Override Key</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>✦ Structural rewrite sequence for credential passphrase</p>
                </div>

                {/* Form Matrix Submission Action */}
                <form onSubmit={submit} className="flex flex-col gap-4">
                    {/* Locked Identity Node Email Field */}
                    <div>
                        <label htmlFor="email" className={labelClass}>Target Routing Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClass}
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="user@domain.route"
                            required
                        />
                        {errors.email && (
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">
                                ⚠️ {errors.email}
                            </p>
                        )}
                    </div>

                    {/* New Password Matrix Field */}
                    <div>
                        <label htmlFor="password" className={labelClass}>New Passphrase Entry</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={inputClass}
                            autoComplete="new-password"
                            autoFocus
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••••••"
                            required
                        />
                        {errors.password && (
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">
                                ⚠️ {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Password Confirmation Field */}
                    <div>
                        <label htmlFor="password_confirmation" className={labelClass}>Verify New Passphrase</label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className={inputClass}
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="••••••••••••"
                            required
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">
                                ⚠️ {errors.password_confirmation}
                            </p>
                        )}
                    </div>

                    {/* Form Submission Segment Block */}
                    <div className="mt-2 pt-4 border-t-2 border-dashed border-black/10 dark:border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto bg-amber-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40 text-center"
                        >
                            {processing ? 'Rewriting Records...' : 'Commit New Credentials'}
                        </button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}