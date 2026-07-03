import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';

const BUBBLE_SIZE = 56;

const SESSION_TYPES = {
    focus:      { color: 'from-red-500 to-orange-500' },
    shortBreak: { color: 'from-green-500 to-emerald-500' },
    longBreak:  { color: 'from-blue-500 to-cyan-500' },
};

const DEFAULT_SETTINGS = {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
};

const LS = {
    get: (k)    => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set: (k, v) => { 
        try { 
            localStorage.setItem(k, JSON.stringify(v)); 
            window.dispatchEvent(new Event('pomo_unified_sync'));
        } catch {} 
    },
};

function computeTimeLeft(saved, startedAt) {
    if (!startedAt) return saved;
    return Math.max(0, saved - Math.floor((Date.now() - startedAt) / 1000));
}

export default function PomodoroWidget() {
    const { theme } = useTheme();
    const dark = theme === 'dark';

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [sessionType, setSessionType] = useState('focus');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [isWidgetHUDOpen, setIsWidgetHUDOpen] = useState(false);

    const bubbleRef = useRef(null);
    const isDragging = useRef(false);
    const hasMoved = useRef(false);
    const mouseStart = useRef({ x: 0, y: 0 });
    const bubbleStart = useRef({ x: 0, y: 0 });
    const timerRef = useRef(null);

    // Sync Engine
    const syncStateEngine = () => {
        const savedSettings = LS.get('pomo_settings');
        if (savedSettings) setSettings({ ...DEFAULT_SETTINGS, ...savedSettings });

        const runState = LS.get('pomo_active_run');
        if (runState) {
            setSessionType(runState.sessionType || 'focus');
            setIsRunning(runState.isRunning);
            setTimeLeft(runState.isRunning ? computeTimeLeft(runState.timeLeft, runState.startedAt) : runState.timeLeft);
        } else {
            setIsRunning(false);
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

    // Timer Interval
    useEffect(() => {
        if (!isRunning) {
            clearInterval(timerRef.current);
            return;
        }
        timerRef.current = setInterval(() => {
            const runState = LS.get('pomo_active_run');
            if (runState && runState.startedAt) {
                setTimeLeft(computeTimeLeft(runState.timeLeft, runState.startedAt));
            }
        }, 200);
        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    // Drag Logic
    const updateBubbleDOMPosition = (x, y) => {
        if (!bubbleRef.current) return;
        bubbleRef.current.style.left = `${x}px`;
        bubbleRef.current.style.top = `${y}px`;
    };

    useEffect(() => {
        const el = bubbleRef.current;
        if (!el) return;

        const savedCoords = LS.get('pomo_bubble_coords');
        const initialCoords = (savedCoords && typeof savedCoords.x === 'number') 
            ? savedCoords 
            : { x: window.innerWidth - BUBBLE_SIZE - 24, y: window.innerHeight - BUBBLE_SIZE - 24 };
            
        updateBubbleDOMPosition(initialCoords.x, initialCoords.y);

        const handleDragStart = (e) => {
            if (e.type === 'mousedown' && e.button !== 0) return;
            isDragging.current = true;
            hasMoved.current = false;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const rect = el.getBoundingClientRect();
            bubbleStart.current = { x: rect.left, y: rect.top };
            mouseStart.current = { x: clientX, y: clientY };
            el.style.cursor = 'grabbing';
        };

        const handleDragMove = (e) => {
            if (!isDragging.current) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const deltaX = clientX - mouseStart.current.x;
            const deltaY = clientY - mouseStart.current.y;

            if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) hasMoved.current = true;

            const targetX = Math.min(Math.max(0, bubbleStart.current.x + deltaX), window.innerWidth - BUBBLE_SIZE);
            const targetY = Math.min(Math.max(0, bubbleStart.current.y + deltaY), window.innerHeight - BUBBLE_SIZE);
            updateBubbleDOMPosition(targetX, targetY);
        };

        const handleDragEnd = () => {
            if (!isDragging.current) return;
            isDragging.current = false;
            el.style.cursor = 'grab';
            const rect = el.getBoundingClientRect();
            LS.set('pomo_bubble_coords', { x: rect.left, y: rect.top });
        };

        el.addEventListener('mousedown', handleDragStart, { passive: false });
        window.addEventListener('mousemove', handleDragMove, { passive: false });
        window.addEventListener('mouseup', handleDragEnd);

        return () => {
            el.removeEventListener('mousedown', handleDragStart);
            window.removeEventListener('mousemove', handleDragMove);
            window.removeEventListener('mouseup', handleDragEnd);
        };
    }, []);

    // Controls
    const toggleBubbleClick = () => {
        if (hasMoved.current) return; 
        setIsWidgetHUDOpen(prev => !prev);
    };

    const startTimer = () => LS.set('pomo_active_run', { sessionType, timeLeft, isRunning: true, startedAt: Date.now() });
    
    const pauseTimer = () => {
        const runState = LS.get('pomo_active_run');
        const calculatedTime = runState ? computeTimeLeft(runState.timeLeft, runState.startedAt) : timeLeft;
        LS.set('pomo_active_run', { sessionType, timeLeft: calculatedTime, isRunning: false, startedAt: null });
    };

    const resetTimer = () => {
        const targetMinutes = sessionType === 'focus' ? settings.focusDuration : sessionType === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration;
        LS.set('pomo_active_run', { sessionType, timeLeft: targetMinutes * 60, isRunning: false, startedAt: null });
    };

    // Styling & Layout
    const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
    const configuredMaxSeconds = (sessionType === 'focus' ? settings.focusDuration : sessionType === 'shortBreak' ? settings.shortBreakDuration : settings.longBreakDuration) * 60;
    const progressPercent = configuredMaxSeconds > 0 ? ((configuredMaxSeconds - timeLeft) / configuredMaxSeconds) * 100 : 0;
    const circumference = 2 * Math.PI * 28;
    const dashoffset = circumference - (progressPercent / 100) * circumference;
    const gradientColorToken = SESSION_TYPES[sessionType]?.color || 'from-red-500 to-orange-500';

    const cardBg = dark ? 'bg-[#1c1a18] border-[#2e2a24]' : 'bg-[#fbf1e3] border-[#1a1a1a]';
    const primaryButtonBg = dark ? 'bg-[#121110] text-white hover:bg-stone-800' : 'bg-white text-black hover:bg-stone-50';

    const getFloatingHUDDynamicStyle = () => {
        if (!bubbleRef.current) return {};
        const rect = bubbleRef.current.getBoundingClientRect();
        const hudWidth = 288;
        const offsetGap = 12;
        const leftPosition = (window.innerWidth - rect.right) >= hudWidth ? rect.left : Math.max(8, rect.right - hudWidth);
        const topPosition = (window.innerHeight - rect.bottom) >= 290 ? rect.bottom + offsetGap : rect.top - 290 - offsetGap;
        return { position: 'fixed', left: `${leftPosition}px`, top: `${topPosition}px`, width: `${hudWidth}px`, zIndex: 9998 };
    };

    // Hide widget if the user is physically on the main Pomodoro page
    if (window.location.pathname === '/student/pomodoro') return null;

    return (
        <>
            <div ref={bubbleRef} onClick={toggleBubbleClick} style={{ position: 'fixed', width: `${BUBBLE_SIZE}px`, height: `${BUBBLE_SIZE}px`, zIndex: 9999, cursor: 'grab', userSelect: 'none' }}>
                <div className={`w-full h-full rounded-full shadow-2xl bg-gradient-to-r ${gradientColorToken} flex items-center justify-center relative overflow-hidden border-2 border-black`}>
                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.25)" strokeWidth="4" fill="none" />
                        <circle cx="32" cy="32" r="28" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashoffset} style={{ transition: 'stroke-dashoffset 0.3s linear' }} />
                    </svg>
                    <span className="relative z-10 text-xl pointer-events-none select-none">{isRunning ? '🍅' : '⏱️'}</span>
                    {isRunning && <span className="absolute inset-0 rounded-full animate-ping bg-white opacity-20 pointer-events-none" />}
                </div>
            </div>

            {isWidgetHUDOpen && (
                <div style={getFloatingHUDDynamicStyle()} className={`rounded-2xl border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${cardBg}`}>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider opacity-75">Mini HUD Mode</span>
                        <button onClick={() => setIsWidgetHUDOpen(false)} className="w-5 h-5 flex items-center justify-center border border-black rounded font-bold text-[10px] bg-red-100 text-red-700">✕</button>
                    </div>
                    <div className="text-center font-unique-bold text-4xl tracking-tight my-2 leading-none">{formatTime(timeLeft)}</div>
                    <div className="flex justify-center gap-2 mt-4">
                        {!isRunning ? (
                            <button onClick={startTimer} className={`flex-1 py-2 border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 bg-gradient-to-r ${gradientColorToken} text-white`}>Start</button>
                        ) : (
                            <button onClick={pauseTimer} className="flex-1 py-2 border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider bg-black text-white dark:bg-stone-800 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5">Pause</button>
                        )}
                        <button onClick={resetTimer} className={`px-3 py-2 border-2 border-black rounded-xl text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 ${primaryButtonBg}`}>🔄</button>
                    </div>
                </div>
            )}
        </>
    );
}