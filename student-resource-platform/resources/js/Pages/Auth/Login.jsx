import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTheme } from '@/hooks/useTheme';

export default function Login({ status, canResetPassword }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const googleLogin = () => {
        window.location.href = '/auth/google';
    };

    // Design layout tokens mapped to standard UI parameters
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] text-white' : 'bg-white text-black';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    const inputClass = `w-full border-2 border-black rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wide focus:outline-none focus:bg-amber-50/10 transition-all ${
        dark ? 'bg-stone-800 text-white placeholder-stone-500' : 'bg-white text-black placeholder-stone-400'
    }`;
    const labelClass = `block text-[11px] font-black uppercase tracking-wider mb-1.5 ${textHeader}`;

    return (
        <GuestLayout>
            <Head title="Log in" />

            {/* Brutalist Gateway Terminal Wrapper */}
            <div className={`max-w-md mx-auto border-2 border-b-[8px] border-black rounded-3xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-sans-custom ${cardBg}`}>
                
                {/* Header Sequence */}
                <div className="mb-6 text-center">
                    <h1 className={`font-unique-bold text-3xl uppercase tracking-tight ${textHeader}`}>Access Terminal</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>✦ Authenticate identity profile credentials</p>
                </div>

                {status && (
                    <div className="mb-4 border-2 border-black bg-emerald-400 text-black font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        ⚡ {status}
                    </div>
                )}

                {/* Third-Party Authentication Entry Point */}
                <div className="mb-5">
                    <button
                        type="button"
                        onClick={googleLogin}
                        className="flex items-center justify-center gap-3 w-full bg-white text-black border-2 border-black rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google Token" className="w-4 h-4 drop-shadow-[0.5px_0.5px_0px_rgba(0,0,0,1)]" />
                        Continue via Google Auth
                    </button>
                </div>

                {/* High-Contrast Section Divider */}
                <div className="relative mb-6 flex items-center justify-center">
                    <div className="absolute w-full border-t-2 border-black/20 dark:border-white/10"></div>
                    <span className={`relative px-3 text-[10px] font-black uppercase tracking-widest text-center ${dark ? 'bg-[#1c1a18] text-stone-500' : 'bg-[#fbf1e3] text-stone-500'}`}>
                        [ OR INTERFACE EMAIL MATRICES ]
                    </span>
                </div>

                {/* Primary Core Authentication Form */}
                <form onSubmit={submit} className="flex flex-col gap-4">
                    {/* Email Routing Row */}
                    <div>
                        <label htmlFor="email" className={labelClass}>Identity Route Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClass}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="user@domain.route"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">
                                ⚠️ {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Passphrase Matrix Row */}
                    <div>
                        <label htmlFor="password" className={labelClass}>Security Passphrase Key</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={inputClass}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••••••"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">
                                ⚠️ {errors.password}
                            </p>
                        )}
                    </div>

                    {/* State Persist Parameter Flag Checkbox */}
                    <div className="block mt-1">
                        <label className="inline-flex items-center cursor-pointer select-none">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-5 h-5 bg-white border-2 border-black rounded-md peer-checked:bg-purple-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center font-black text-black text-xs">
                                    {data.remember && '✓'}
                                </div>
                            </div>
                            <span className={`ms-2 text-[11px] font-black uppercase tracking-wider ${dark ? 'text-stone-300' : 'text-stone-800'}`}>
                                Retain terminal state parameters
                            </span>
                        </label>
                    </div>

                    {/* Form Submission Action Row */}
                    <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-black/10 dark:border-white/5">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:text-red-400 underline transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        )}
                        
                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto bg-blue-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40"
                        >
                            {processing ? 'Decrypting Session...' : 'Login to StudyShare'}
                        </button>
                    </div>

                    {/* Alternate Registration Subtext Anchor */}
                    <div className="mt-4 text-center text-[11px] font-bold uppercase tracking-wider border-2 border-black rounded-xl p-2.5 bg-black/5 dark:bg-white/5">
                        <span className={textMuted}>Identity node un-mapped?</span>{' '}
                        <Link href="/register" className="text-blue-400 font-black hover:underline tracking-wide">
                            New to Studyshare 
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}