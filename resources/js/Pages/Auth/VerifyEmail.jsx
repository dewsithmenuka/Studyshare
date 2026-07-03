import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTheme } from '@/hooks/useTheme';

export default function VerifyEmail({ status }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    // Design layout tokens mapped to standard UI parameters
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400' : 'text-stone-600';
    const textHeader = dark ? 'text-white' : 'text-black';

    return (
        <GuestLayout>
            <Head title="Identity Verification" />

            {/* Brutalist Verification Box Framework */}
            <div className={`max-w-md mx-auto border-2 border-b-[8px] border-black rounded-3xl p-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-sans-custom ${cardBg}`}>
                
                {/* Header Context */}
                <div className="mb-6 text-center">
                    <h1 className={`font-unique-bold text-3xl uppercase tracking-tight ${textHeader}`}>Verify Node</h1>
                    <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${textMuted}`}>✦ Structural identity confirmation required</p>
                </div>

                <div className={`mb-6 text-xs font-medium leading-relaxed border-2 border-black p-4 rounded-2xl bg-black/5 dark:bg-white/5 ${dark ? 'text-stone-300' : 'text-stone-800'}`}>
                    Registration sequence initiated! Before accessing the collective directory, please verify your email address by clicking the link we just transmitted to your endpoint. If the packet was dropped, we will gladly broadcast another.
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-6 border-2 border-black bg-emerald-400 text-black font-black text-[10px] uppercase tracking-wider px-4 py-3 rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        ⚡ A new authorization link has been re-transmitted to the provided routing address.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-black/10 dark:border-white/5">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto bg-blue-400 text-black border-2 border-black text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-40"
                        >
                            {processing ? 'Broadcasting...' : 'Resend Auth Packet'}
                        </button>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-[10px] font-black uppercase tracking-wider text-stone-400 hover:text-red-500 underline transition-colors"
                        >
                            Terminate Session
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}