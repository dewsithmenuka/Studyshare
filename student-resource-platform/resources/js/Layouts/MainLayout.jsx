import { Link, router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import PomodoroWidget from '@/Components/PomodoroWidget';

export default function MainLayout({ children, auth }) {
    const { theme, toggleTheme } = useTheme();
    const dark = theme === 'dark';
    const isAdmin = auth?.user?.roles?.some(r => r.name === 'admin');
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const [clearing, setClearing] = useState(false);
    const notifRef = useRef(null);

    const handleLogout = () => router.post('/logout');

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isAdmin && auth?.user) {
            fetch('/student/notifications', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            })
            .then(res => res.json())
            .then(data => {
                setNotifications(data.notifications || []);
                setUnread(data.unread || 0);
            })
            .catch(() => {});

            if (window.Echo) {
                window.Echo.private('user.' + auth.user.id)
                    .listen('.resource.status.changed', (e) => {
                        setNotifications(prev => [{ id: Date.now(), data: e, read_at: null, created_at: 'Just now' }, ...prev]);
                        setUnread(prev => prev + 1);
                    })
                    .listen('.group.member.added', (e) => {
                        setNotifications(prev => [{ id: Date.now(), data: e, read_at: null, created_at: 'Just now' }, ...prev]);
                        setUnread(prev => prev + 1);
                    })
                    .listen('.contact.replied', (e) => {
                        setNotifications(prev => [{ id: Date.now(), data: e, read_at: null, created_at: 'Just now' }, ...prev]);
                        setUnread(prev => prev + 1);
                    });
            }
        }
    }, [auth?.user?.id, isAdmin]);

    const getCsrf = () => document.head.querySelector('meta[name="csrf-token"]')?.content || '';

    const markAllRead = () => {
        fetch('/student/notifications/read', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCsrf(), 'X-Requested-With': 'XMLHttpRequest' },
            credentials: 'same-origin',
        }).then(() => {
            setUnread(0);
            setNotifications(prev => prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
        });
    };

    const clearReadNotifications = async () => {
        setClearing(true);
        try {
            await fetch('/student/notifications/clear', {
                method: 'DELETE',
                headers: { 'Accept': 'application/json', 'X-CSRF-TOKEN': getCsrf(), 'X-Requested-With': 'XMLHttpRequest' },
                credentials: 'same-origin',
            });
            setNotifications(prev => prev.filter(n => !n.read_at));
        } catch (e) { console.error(e); }
        finally { setClearing(false); }
    };

    const readCount = notifications.filter(n => n.read_at).length;

    // Restored the Pomodoro link here so students can access the main UI
    const studentLinks = [
        { href: '/student/dashboard',   label: 'Dashboard', icon: '🏠' },
        { href: '/student/library',     label: 'Library',   icon: '📚' },
        { href: '/student/browse',      label: 'Browse',    icon: '🔍' },
        { href: '/student/upload',      label: 'Upload',    icon: '📤' },
        { href: '/student/favorites',   label: 'Favorites', icon: '❤️' },
        { href: '/student/groups',      label: 'Groups',    icon: '👥' },
        { href: '/student/ai-analyzer', label: 'AI',        icon: '🤖' },
        { href: '/student/pomodoro',    label: 'Pomodoro',  icon: '🍅' },
        { href: '/student/contact',     label: 'Contact',   icon: '✉️' },
        { href: '/student/profile',     label: 'Profile',   icon: '👤' },
    ];

    const adminLinks = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
        { href: '/admin/resources', label: 'Resources', icon: '📁' },
        { href: '/admin/users',     label: 'Users',     icon: '👥' },
        { href: '/admin/contact',   label: 'Messages',  icon: '✉️' },
    ];

    const links = isAdmin ? adminLinks : studentLinks;

    /* ── Brutalist & Modern Color Alignment ── */
    const sidebarBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const pageBg    = dark ? 'bg-[#121110]'                  : 'bg-[#fcf8f2]';
    const topBarBg  = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const textColor = dark ? 'text-stone-100'                : 'text-[#1a1a1a]';
    const textMuted = dark ? 'text-stone-400'                : 'text-stone-600';
    const divider   = dark ? 'border-[#2e2a24]'              : 'border-[#1a1a1a]';

    return (
        <>
            <Head>
                <title>StudyShare - AI Powered Student Collaboration Platform</title>
                <meta name="description" content="StudyShare is an AI-powered academic collaboration platform where university students can share resources, study together, chat in groups, and use AI tools for learning." />
            </Head>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
                
                .font-unique-bold { 
                    font-family: 'Big Shoulders Display', sans-serif; 
                    font-weight: 900;
                    text-transform: uppercase;
                    letter-spacing: -0.01em;
                }
                
                .font-sans-custom { font-family: 'Plus Jakarta Sans', sans-serif; }
                
                .neo-btn-sm {
                    transition: all 0.15s ease-in-out;
                }
                .neo-btn-sm:active {
                    transform: translate(1px, 1px);
                    box-shadow: 0px 0px 0px 0px #1a1a1a;
                }
            `}</style>

            <div className={`flex min-h-screen font-sans-custom ${pageBg} ${textColor} transition-colors duration-300`}>

                {/* ── Left Sidebar (desktop) ── */}
                <aside
                    onMouseEnter={() => setSidebarExpanded(true)}
                    onMouseLeave={() => setSidebarExpanded(false)}
                    className={`
                        hidden lg:flex flex-col fixed top-0 left-0 h-full z-50
                        border-r-2 transition-all duration-300 ease-in-out
                        ${sidebarBg}
                        ${sidebarExpanded ? 'w-56' : 'w-16'}
                    `}
                >
                    <div className={`flex items-center h-16 px-3 border-b-2 ${divider} gap-3 overflow-hidden flex-shrink-0`}>
                        <div className="w-9 h-9 bg-amber-400 border-2 border-black rounded-lg flex items-center justify-center text-lg flex-shrink-0 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                            📚
                        </div>
                        <span className={`font-unique-bold text-2xl tracking-tight mt-0.5 whitespace-nowrap transition-all duration-300 ${sidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}>
                            StudyShare
                        </span>
                    </div>

                    <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden space-y-1">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-3 py-2 mx-2 rounded-xl border-2 border-transparent transition-all group overflow-hidden ${
                                    window.location.pathname === link.href 
                                        ? 'bg-amber-400 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                        : 'hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                            >
                                <span className="text-lg flex-shrink-0 w-8 text-center">{link.icon}</span>
                                <span className={`text-sm font-bold whitespace-nowrap transition-all duration-300 ${sidebarExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}>
                                    {link.label}
                                </span>
                            </Link>
                        ))}
                    </nav>

                    <div className={`border-t-2 ${divider} p-3 flex-shrink-0`}>
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 rounded-lg border border-black bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-sm">
                                {auth?.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className={`flex-1 min-w-0 transition-all duration-300 ${sidebarExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                <p className="text-xs font-bold truncate">{auth?.user?.name}</p>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-[11px] font-bold mt-0.5 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* ── Mobile Sidebar ── */}
                {mobileSidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                        onClick={() => setMobileSidebarOpen(false)}
                    />
                )}
                <aside className={`
                    lg:hidden fixed top-0 left-0 h-full z-50 w-64 flex flex-col
                    border-r-2 transition-transform duration-300 ease-in-out
                    ${sidebarBg}
                    ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}>
                    <div className={`flex items-center justify-between h-14 px-4 border-b-2 ${divider} flex-shrink-0`}>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-amber-400 border-2 border-black rounded-lg flex items-center justify-center text-base shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                📚
                            </div>
                            <span className="font-unique-bold text-xl tracking-tight mt-0.5">StudyShare</span>
                        </div>
                        <button 
                            onClick={() => setMobileSidebarOpen(false)} 
                            className="w-7 h-7 flex items-center justify-center border-2 border-black bg-white dark:bg-stone-800 rounded-md font-bold text-xs shadow-sm"
                        >
                            ✕
                        </button>
                    </div>
                    <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-1">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border-2 transition-all ${
                                    window.location.pathname === link.href 
                                        ? 'bg-amber-400 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
                                        : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'
                                }`}
                            >
                                <span className="text-base">{link.icon}</span>
                                <span className="text-sm font-bold">{link.label}</span>
                            </Link>
                        ))}
                    </nav>
                    <div className={`border-t-2 ${divider} p-4 flex-shrink-0 flex items-center justify-between`}>
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-lg border border-black bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                                {auth?.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold truncate pr-1">{auth?.user?.name}</span>
                        </div>
                        <button 
                            onClick={handleLogout} 
                            className="text-red-500 dark:text-red-400 text-xs font-bold bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-2 py-1 rounded-md flex-shrink-0"
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                {/* ── Main Panel ── */}
                <div className="flex-1 flex flex-col min-w-0 lg:ml-16 transition-all duration-300">
                    <header className={`sticky top-0 z-40 h-14 border-b-2 flex items-center px-4 gap-3 flex-shrink-0 ${topBarBg}`}>
                        <button
                            onClick={() => setMobileSidebarOpen(true)}
                            className="lg:hidden w-9 h-9 border-2 border-black rounded-xl bg-white dark:bg-stone-800 flex flex-col items-center justify-center gap-1 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] neo-btn-sm"
                        >
                            <span className="block w-4 h-0.5 bg-black dark:bg-white"></span>
                            <span className="block w-4 h-0.5 bg-black dark:bg-white"></span>
                            <span className="block w-4 h-0.5 bg-black dark:bg-white"></span>
                        </button>

                        <div className="flex-1" />

                        <button
                            onClick={toggleTheme}
                            className="w-9 h-9 border-2 border-black rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] neo-btn-sm"
                        >
                            {dark ? '☀️' : '🌙'}
                        </button>

                        {!isAdmin && auth?.user && (
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => { setNotifOpen(!notifOpen); if (unread > 0) markAllRead(); }}
                                    className="w-9 h-9 border-2 border-black rounded-xl bg-white dark:bg-stone-800 flex items-center justify-center text-sm shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] neo-btn-sm relative"
                                >
                                    <span>🔔</span>
                                    {unread > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-black border border-black shadow-sm">
                                            {unread > 9 ? '9+' : unread}
                                        </span>
                                    )}
                                </button>

                                {notifOpen && (
                                    <div className={`absolute right-0 top-11 w-72 sm:w-80 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden border-2 border-black ${dark ? 'bg-[#1c1a18]' : 'bg-white'}`}>
                                        <div className={`px-4 py-3 border-b-2 flex items-center justify-between ${divider}`}>
                                            <h3 className="font-unique-bold text-lg tracking-tight">
                                                Notifications
                                                {notifications.length > 0 && (
                                                    <span className={`ml-1.5 text-xs font-sans font-bold ${textMuted}`}>
                                                        ({notifications.length})
                                                    </span>
                                                )}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                {readCount > 0 && (
                                                    <button
                                                        onClick={clearReadNotifications}
                                                        disabled={clearing}
                                                        className="text-[10px] font-bold px-2 py-1 rounded-md border border-black bg-stone-100 hover:bg-red-100 dark:bg-stone-800 dark:hover:bg-red-950/40 text-stone-700 dark:text-stone-300 transition-colors"
                                                    >
                                                        {clearing ? '...' : `🗑 Clear (${readCount})`}
                                                    </button>
                                                )}
                                                <button onClick={() => setNotifOpen(false)} className="text-stone-400 hover:text-stone-600 font-bold text-sm">✕</button>
                                            </div>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto divide-y-2 dark:divide-[#2e2a24] divide-stone-100">
                                            {notifications.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <p className="text-2xl mb-1">📬</p>
                                                    <p className={`text-xs font-medium ${textMuted}`}>Inbox clean and clear</p>
                                                </div>
                                            ) : (
                                                notifications.slice(0, 10).map((n, i) => (
                                                    <div
                                                        key={n.id || i}
                                                        className={`px-4 py-3 transition-colors ${!n.read_at ? (dark ? 'bg-amber-400/10' : 'bg-amber-400/5') : 'hover:bg-stone-50 dark:hover:bg-stone-800/40'}`}
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <p className="text-xs font-medium leading-relaxed flex-1">
                                                                {!n.read_at && <span className="inline-block w-2 h-2 bg-amber-400 border border-black rounded-full mr-1.5"></span>}
                                                                {n.data?.message}
                                                            </p>
                                                        </div>
                                                        <p className={`text-[10px] font-mono mt-1 ${textMuted}`}>{n.created_at}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className={`flex items-center gap-2 pl-2 border-l-2 ${divider}`}>
                            <div className="w-8 h-8 rounded-lg border border-black bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
                                {auth?.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-black hidden md:block max-w-28 truncate">
                                {auth?.user?.name}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="hidden sm:flex items-center gap-1.5 text-xs text-red-500 font-bold transition-all px-2.5 py-1.5 rounded-xl border border-transparent hover:border-red-300 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                            <span>Logout</span>
                        </button>
                    </header>

                    <main className="flex-1 p-4 sm:p-6 overflow-auto">
                        <div className="max-w-6xl mx-auto">
                            {children}
                        </div>
                    </main>
                </div>

                {/* ── Global Floating Drag Widget Layer ── */}
                {(!isAdmin && auth?.user) && <PomodoroWidget />}
            </div>
        </>
    );
}