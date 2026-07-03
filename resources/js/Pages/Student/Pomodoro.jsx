import { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { useTheme } from '@/hooks/useTheme';

const SESSION_TYPES = {
    focus:      { label: '🍅 Focus Session', color: 'from-red-500 to-orange-500',   bgPill: 'bg-red-400' },
    shortBreak: { label: '☕ Short Break',   color: 'from-green-500 to-emerald-500', bgPill: 'bg-emerald-400' },
    longBreak:  { label: '🌴 Long Break',    color: 'from-blue-500 to-cyan-500',     bgPill: 'bg-blue-400' },
};

const QUOTES = [
    "Small consistent progress beats motivation.",
    "Focus is the key to all success.",
    "One step at a time leads to great distances.",
    "The secret of getting ahead is getting started.",
    "Productivity is never an accident.",
];

const DEFAULT_SETTINGS = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsBeforeLongBreak: 4,
    soundEnabled: true,
    notificationsEnabled: true,
};

const LS = {
    get: (k)    => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set: (k, v) => { 
        try { 
            localStorage.setItem(k, JSON.stringify(v)); 
            window.dispatchEvent(new Event('pomo_unified_sync'));
        } catch {} 
    },
    del: (k)    => { 
        try { 
            localStorage.removeItem(k); 
            window.dispatchEvent(new Event('pomo_unified_sync'));
        } catch {} 
    },
};

function computeTimeLeft(saved, startedAt) {
    if (!startedAt) return saved;
    return Math.max(0, saved - Math.floor((Date.now() - startedAt) / 1000));
}

export default function Pomodoro({ auth }) {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    /* ── Reactive UI Engine States ── */
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [sessionType, setSessionType] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
    const [showSettings, setShowSettings] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(QUOTES[0]);

    const timerRef = useRef(null);
    const sessionTypeRef = useRef(sessionType);
    const settingsRef = useRef(settings);

    useEffect(() => { sessionTypeRef.current = sessionType; }, [sessionType]);
    useEffect(() => { settingsRef.current = settings; }, [settings]);

    /* ── Single-Source Engine Storage Synchronization Loop ── */
    const syncStateEngine = () => {
        const savedSettings = LS.get('pomo_settings');
        if (savedSettings) setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });

        const savedMetrics = LS.get('pomo_metrics_state');
        if (savedMetrics) {
            setSessionsCompleted(savedMetrics.sessionsCompleted || 0);
            setTotalFocusMinutes(savedMetrics.totalFocusMinutes || 0);
        }

        const runState = LS.get('pomo_active_run');
        if (runState) {
            const calculatedTime = computeTimeLeft(runState.timeLeft, runState.startedAt);
            setSessionType(runState.sessionType || 'focus');
            setIsRunning(runState.isRunning);
            
            if (runState.isRunning) {
                setTimeLeft(calculatedTime);
            } else {
                setTimeLeft(runState.timeLeft);
            }
        } else {
            setIsRunning(false);
            const cfg = settingsRef.current;
            const activeType = sessionTypeRef.current;
            const targetMinutes = activeType === 'focus' ? cfg.focusDuration : activeType === 'shortBreak' ? cfg.shortBreakDuration : cfg.longBreakDuration;
            setTimeLeft(targetMinutes * 60);
        }
    };

    useEffect(() => {
        syncStateEngine();
        window.addEventListener('storage', syncStateEngine);
        window.addEventListener('pomo_unified_sync', syncStateEngine);

        return () => {
            window.removeEventListener('storage', syncStateEngine);
            window.removeEventListener('pomo_unified_sync', syncStateEngine);
        };
    }, []);

    useEffect(() => {
        LS.set('pomo_settings', settings);
    }, [settings]);

    /* ── Unified High-Accuracy Chronometer Loop ── */
    useEffect(() => {
        if (!isRunning) {
            clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(() => {
            const runState = LS.get('pomo_active_run');
            if (runState && runState.startedAt) {
                const actualTime = computeTimeLeft(runState.timeLeft, runState.startedAt);
                setTimeLeft(actualTime);
                
                if (actualTime <= 0) {
                    setIsRunning(false);
                    clearInterval(timerRef.current);
                    LS.del('pomo_active_run');
                    handleSessionCompleteRef.current();
                }
            }
        }, 200);

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const handleSessionComplete = () => {
        const currentType = sessionTypeRef.current;
        const cfg = settingsRef.current;

        if (cfg.soundEnabled) {
            try {
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                oscillator.frequency.value = 880;
                gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.5);
            } catch (err) {}
        }

        if (cfg.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(`${SESSION_TYPES[currentType]?.label} Finished!`, {
                body: currentType === 'focus' ? 'Time for a well-deserved break! ☕' : 'Ready to crush another milestone? 🍅',
            });
        }

        let nextSessionType = 'focus';
        let updatedSessionsCompleted = sessionsCompleted;

        if (currentType === 'focus') {
            updatedSessionsCompleted += 1;
            setSessionsCompleted(updatedSessionsCompleted);
            setTotalFocusMinutes(prev => prev + cfg.focusDuration);

            if (updatedSessionsCompleted % cfg.sessionsBeforeLongBreak === 0) {
                nextSessionType = 'longBreak';
            } else {
                nextSessionType = 'shortBreak';
            }
        }

        const nextMinutes = nextSessionType === 'focus' ? cfg.focusDuration : nextSessionType === 'shortBreak' ? cfg.shortBreakDuration : cfg.longBreakDuration;

        LS.set('pomo_metrics_state', {
            sessionsCompleted: updatedSessionsCompleted,
            totalFocusMinutes: totalFocusMinutes + (currentType === 'focus' ? cfg.focusDuration : 0)
        });

        LS.set('pomo_active_run', {
            sessionType: nextSessionType,
            timeLeft: nextMinutes * 60,
            isRunning: false,
            startedAt: null
        });

        setCurrentQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    };

    const handleSessionCompleteRef = useRef(handleSessionComplete);
    useEffect(() => { handleSessionCompleteRef.current = handleSessionComplete; });

    /* ── Interactive Workspace Mechanics ── */
    const startTimer = () => {
        if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
        LS.set('pomo_active_run', { sessionType, timeLeft, isRunning: true, startedAt: Date.now() });
    };

    const pauseTimer = () => {
        const runState = LS.get('pomo_active_run');
        const calculatedTime = runState ? computeTimeLeft(runState.timeLeft, runState.startedAt) : timeLeft;
        LS.set('pomo_active_run', { sessionType, timeLeft: calculatedTime, isRunning: false, startedAt: null });
    };

    const resetTimer = () => {
        const targetMinutes = sessionType === 'focus' ? settings.focusDuration : sessionType === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration;
        LS.set('pomo_active_run', { sessionType, timeLeft: targetMinutes * 60, isRunning: false, startedAt: null });
    };

    const skipSession = () => {
        handleSessionComplete();
    };

    const selectSessionType = (type) => {
        const targetMinutes = type === 'focus' ? settings.focusDuration : type === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration;
        LS.set('pomo_active_run', { sessionType: type, timeLeft: targetMinutes * 60, isRunning: false, startedAt: null });
    };

    const formatTime = (seconds) =>
        `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

    const configuredMaxSeconds = (sessionType === 'focus' ? settings.focusDuration : sessionType === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration) * 60;
    const progressPercent = configuredMaxSeconds > 0 ? ((configuredMaxSeconds - timeLeft) / configuredMaxSeconds) * 100 : 0;

    // Neo-Brutalist design systems tokens
    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const subCardBg = dark ? 'bg-[#121110] border-[#2e2a24]' : 'bg-[#fcf8f2] border-[#1a1a1a]';

    return (
        <MainLayout auth={auth}>
            <Head title="🍅 Workspace Timer" />

            {/* ── CORE WORKSPACE DASHBOARD VIEWPORT ── */}
            <div className="py-4 max-w-xl mx-auto font-sans-custom">
                <div className="text-center mb-6">
                    <h1 className="font-unique-bold text-5xl tracking-tight uppercase">Focus Environment</h1>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">✦ Single Unified Codebase Framework</p>
                </div>

                {/* Session Pill Navigation Controls */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                    {Object.keys(SESSION_TYPES).map((type) => (
                        <button
                            key={type}
                            onClick={() => selectSessionType(type)}
                            className={`py-2.5 font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-black transition-all ${
                                sessionType === type
                                    ? `${SESSION_TYPES[type].bgPill} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5`
                                    : `${dark ? 'bg-stone-800 text-stone-400' : 'bg-white text-stone-700'} opacity-60`
                            }`}
                        >
                            {type === 'focus' ? '🍅 Focus' : type === 'shortBreak' ? '☕ Break' : '🌴 Long'}
                        </button>
                    ))}
                </div>

                {/* Primary Card View Workspace HUD */}
                <div className={`border-2 border-b-[10px] border-black rounded-[2.5rem] p-6 md:p-8 relative ${cardBg}`}>
                    <h2 className="font-unique-bold text-2xl tracking-wide text-center uppercase mb-4">
                        {SESSION_TYPES[sessionType]?.label}
                    </h2>

                    {/* Radial Timer Layout Configuration */}
                    <div className="relative w-56 h-56 mx-auto mb-6 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
                            <circle cx="120" cy="120" r="100" stroke={dark ? '#2e2a24' : '#1a1a1a'} strokeWidth="4" fill="none" opacity="0.15" />
                            <circle cx="120" cy="120" r="100" 
                                    stroke={sessionType === 'focus' ? '#ef4444' : sessionType === 'shortBreak' ? '#34d399' : '#60a5fa'} 
                                    strokeWidth="8" fill="none" strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 100} strokeDashoffset={2 * Math.PI * 100 - (progressPercent / 100) * (2 * Math.PI * 100)}
                                    style={{ transition: 'stroke-dashoffset 0.3s linear' }} />
                        </svg>
                        <div className="text-center z-10">
                            <div className="font-unique-bold text-6xl leading-none">{formatTime(timeLeft)}</div>
                            {isRunning && <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 animate-pulse block mt-1">● sync ticking</span>}
                        </div>
                    </div>

                    {/* Action Hub Panels */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        {!isRunning ? (
                            <button onClick={startTimer} className={`px-8 py-3 text-sm font-black uppercase tracking-wider text-black rounded-xl border-2 border-black ${SESSION_TYPES[sessionType]?.bgPill} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all`}>
                                Start Play
                            </button>
                        ) : (
                            <button onClick={pauseTimer} className="px-8 py-3 text-sm font-black uppercase tracking-wider text-white bg-black dark:bg-stone-800 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all">
                                Pause Session
                            </button>
                        )}
                        <button onClick={resetTimer} className={`w-11 h-11 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${subCardBg}`} title="Reset">
                            🔄
                        </button>
                        <button onClick={skipSession} className={`w-11 h-11 border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${subCardBg}`} title="Skip Session">
                            ⏭️
                        </button>
                    </div>

                    <p className="text-center text-xs font-medium italic opacity-70 px-4">"{currentQuote}"</p>

                    <button onClick={() => setShowSettings(!showSettings)} className={`absolute top-4 right-4 w-8 h-8 border-2 border-black rounded-lg flex items-center justify-center text-xs shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] ${subCardBg}`}>
                        ⚙️
                    </button>
                </div>

                {/* Configuration Submenus */}
                {showSettings && (
                    <div className={`mt-4 border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${cardBg}`}>
                        <h3 className="font-unique-bold text-lg uppercase mb-3">Settings Configuration</h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {[
                                { label: 'Focus (min)',          key: 'focusDuration' },
                                { label: 'Short Break (min)',    key: 'shortBreakDuration' },
                                { label: 'Long Break (min)',     key: 'longBreakDuration' },
                                { label: 'Sessions Until Long',  key: 'sessionsBeforeLongBreak' },
                            ].map(({ label, key }) => (
                                <div key={key}>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">{label}</label>
                                    <input
                                        type="number"
                                        value={settings[key]}
                                        onChange={(e) => setSettings(s => ({ ...s, [key]: parseInt(e.target.value) || 1 }))}
                                        className={`w-full text-center font-bold text-xs border-2 border-black rounded-xl py-1.5 ${subCardBg}`}
                                        min="1" max="60"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
                                    className={`py-2 text-[11px] font-black uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${settings.soundEnabled ? 'bg-emerald-400' : 'bg-stone-300 dark:bg-stone-700'}`}>
                                {settings.soundEnabled ? '🔊 Sound: On' : '🔇 Sound: Off'}
                            </button>
                            <button onClick={() => setSettings(s => ({ ...s, notificationsEnabled: !s.notificationsEnabled }))}
                                    className={`py-2 text-[11px] font-black uppercase border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${settings.notificationsEnabled ? 'bg-emerald-400' : 'bg-stone-300 dark:bg-stone-700'}`}>
                                {settings.notificationsEnabled ? '🔔 Notif: On' : '🔕 Notif: Off'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Dashboard Metrics Aggregation Section */}
                <div className={`mt-6 border-2 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${cardBg}`}>
                    <h3 className="font-unique-bold text-lg uppercase mb-4 text-center">Focus Session Analytics</h3>
                    <div className="grid grid-cols-3 gap-2 text-center divide-x-2 divide-black/20 dark:divide-white/10">
                        <div>
                            <div className="font-unique-bold text-3xl leading-none">{sessionsCompleted}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-1">Sessions</div>
                        </div>
                        <div>
                            <div className="font-unique-bold text-3xl leading-none">{totalFocusMinutes}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-1">Minutes</div>
                        </div>
                        <div>
                            <div className="font-unique-bold text-3xl leading-none">{sessionsCompleted >= settings.sessionsBeforeLongBreak ? '🔥' : '❄️'}</div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mt-1">Streak</div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}