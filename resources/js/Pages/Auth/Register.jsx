import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTheme } from '@/hooks/useTheme';

export default function Register() {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const googleLogin = () => {
        window.location.href = '/auth/google';
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
            <Head title="Register Identity" />

            {/* Brutalist Gateway Terminal Wrapper */}
            <div className={`max-w-md mx-auto border-2 border-b-[8px] border-black rounded-3xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-sans-custom ${cardBg}`}>
                
                {/* Header Sequence */}
                <div className="mb-6 text-center">
                    <h1 className={`font-unique-bold text-3xl uppercase tracking-tight ${textHeader}`}>Spawn Node</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>✦ Initialize a new student identity profile</p>
                </div>

                {/* Third-Party Authentication Entry Point */}
                <div className="mb-5">
                    <button
                        type="button"
                        onClick={googleLogin}
                        className="flex items-center justify-center gap-3 w-full bg-white text-black border-2 border-black rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google Token" className="w-4 h-4 drop-shadow-[0.5px_0.5px_0px_rgba(0,0,0,1)]" />
                        Initialize via Google
                    </button>
                </div>

                {/* High-Contrast Section Divider */}
                <div className="relative mb-6 flex items-center justify-center">
                    <div className="absolute w-full border-t-2 border-black/20 dark:border-white/10"></div>
                    <span className={`relative px-3 text-[10px] font-black uppercase tracking-widest text-center ${dark ? 'bg-[#1c1a18] text-stone-500' : 'bg-[#fbf1e3] text-stone-500'}`}>
                        [ OR CREATE NATIVE RECORD ]
                    </span>
                </div>

                {/* Primary Registration Form */}
                <form onSubmit={submit} className="flex flex-col gap-4">
                    {/* Entity Name Row */}
                    <div>
                        <label htmlFor="name" className={labelClass}>Identity Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            className={inputClass}
                            autoComplete="name"
                            autoFocus
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g. ALEX ROWE"
                            required
                        />
                        {errors.name && (
                            <p className="text-red-500 text-[10px] font-black uppercase tracking-wider mt-1.5">
                                ⚠️ {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email Routing Row */}
                    <div>
                        <label htmlFor="email" className={labelClass}>Routing Communication Email</label>
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

                    {/* Passphrase Entry */}
                    <div>
                        <label htmlFor="password" className={labelClass}>Security Passphrase Key</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className={inputClass}
                            autoComplete="new-password"
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

                    {/* Passphrase Verification */}
                    <div>
                        <label htmlFor="password_confirmation" className={labelClass}>Confirm Passphrase Entry</label>
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

                    {/* Form Submission Action Interface Layout */}
                    <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-black/10 dark:border-white/5">
                        <Link
                            href={route('login')}
                            className="text-[10px] font-black uppercase tracking-wider text-stone-400 hover:text-blue-400 underline transition-colors"
                        >
                            Identity already mapped? Log in
                        </Link>
                        
                        <button 
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto bg-purple-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40"
                        >
                            {processing ? 'Registering Node...' : 'Register the Account'}
                        </button>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}