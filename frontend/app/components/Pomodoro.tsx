'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

export default function Pomodoro() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    // Audio ref (optional, simplified for now)
    // const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play sound?
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const switchMode = (newMode: 'focus' | 'break') => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(newMode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'focus'
        ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
        : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

    return (
        <div className={`h-full retro-card p-4 flex flex-col justify-between relative overflow-hidden transition-colors duration-500 ${mode === 'focus' ? 'bg-[#FF6B6B]' : 'bg-[#6BCB77]'}`}>

            {/* Header / Tabs */}
            <div className="flex justify-center gap-2 relative z-10">
                <button
                    onClick={() => switchMode('focus')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border-2 border-black transition-all ${mode === 'focus' ? 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-black/10 text-black/60 hover:bg-black/20'}`}
                >
                    Focus
                </button>
                <button
                    onClick={() => switchMode('break')}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold border-2 border-black transition-all ${mode === 'break' ? 'bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-black/10 text-black/60 hover:bg-black/20'}`}
                >
                    Break
                </button>
            </div>

            {/* Timer Display */}
            <div className="flex-1 flex flex-col items-center justify-center relative z-10 -mt-2">
                <div className="text-5xl font-black text-black tracking-widest font-mono">
                    {formatTime(timeLeft)}
                </div>
                <div className="text-xs font-bold text-black/60 mt-1 uppercase tracking-wide flex items-center gap-2">
                    {mode === 'focus' ? <><Zap className="w-3 h-3 fill-black" /> Stay Focused</> : <><Coffee className="w-3 h-3" /> Take a Break</>}
                </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 relative z-10">
                <button
                    onClick={toggleTimer}
                    className="w-10 h-10 bg-white rounded-full border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[3px] active:shadow-none"
                >
                    {isActive ? <Pause className="w-5 h-5 fill-black" /> : <Play className="w-5 h-5 fill-black translate-x-0.5" />}
                </button>
                <button
                    onClick={resetTimer}
                    className="w-10 h-10 bg-black text-white rounded-full border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>

            {/* Background Progress Bar (Fill effect) */}
            <div
                className="absolute bottom-0 left-0 w-full bg-black/10 transition-all duration-1000 ease-linear pointer-events-none"
                style={{ height: `${progress}%` }}
            ></div>
        </div>
    );
}
