'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

interface Event {
    _id: string;
    title: string;
    date: string;
    type: string;
}

export default function Calendar() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newEventTitle, setNewEventTitle] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchEvents(token);
        }
    }, []);

    const fetchEvents = async (token: string) => {
        try {
            const res = await fetch(`${API_URL}/api/events`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setEvents(data);
            } else {
                setEvents([]); // Fallback if error or not array
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        }
    };

    const handlePrevMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const clickedDate = new Date(date.getFullYear(), date.getMonth(), day);
        setSelectedDate(clickedDate);
        setShowModal(true);
    };

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate || !newEventTitle) return;

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            await fetch(`${API_URL}/api/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newEventTitle,
                    date: selectedDate,
                    type: 'event'
                })
            });
            setNewEventTitle('');
            setShowModal(false);
            fetchEvents(token);
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const monthName = date.toLocaleString('default', { month: 'long' });

    const getEventsForDay = (day: number) => {
        return events.filter(e => {
            const eDate = new Date(e.date);
            return eDate.getDate() === day &&
                eDate.getMonth() === date.getMonth() &&
                eDate.getFullYear() === date.getFullYear();
        });
    };

    return (
        <div className="h-full retro-card bg-[#FDF9F0] p-4 flex flex-col relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg uppercase">{monthName} {date.getFullYear()}</h3>
                <div className="flex gap-1">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-black/10 rounded-full">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-black/10 rounded-full">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-gray-400">{d}</div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-1 flex-1 content-start">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dayEvents = getEventsForDay(day);
                    const isToday = new Date().getDate() === day &&
                        new Date().getMonth() === date.getMonth() &&
                        new Date().getFullYear() === date.getFullYear();

                    return (
                        <div
                            key={day}
                            onClick={() => handleDateClick(day)}
                            className={`
                                h-10 w-full flex flex-col items-center justify-center rounded-lg cursor-pointer hover:bg-black/5 transition-colors relative
                                ${isToday ? 'bg-black text-white hover:bg-black/90' : ''}
                            `}
                        >
                            <span>{day}</span>
                            <div className="flex gap-0.5 mt-0.5">
                                {dayEvents.map((e, index) => (
                                    <div
                                        key={index}
                                        className={`w-1.5 h-1.5 rounded-full ${e.type === 'holiday' ? 'bg-[#FF6B6B]' : (isToday ? 'bg-[var(--color-accent-yellow)]' : 'bg-black')}`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#FDF9F0] w-full max-w-sm rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] p-6 flex flex-col animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-xl">Add Event</h4>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        {selectedDate && (
                            <p className="text-sm font-bold text-gray-500 mb-6 uppercase tracking-wider">
                                {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        )}
                        <form onSubmit={handleAddEvent} className="flex-1 flex flex-col gap-4">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Event title..."
                                value={newEventTitle}
                                onChange={(e) => setNewEventTitle(e.target.value)}
                                className="w-full bg-white border-2 border-black/10 focus:border-black rounded-xl p-4 font-bold text-lg outline-none transition-all"
                            />
                            <button type="submit" className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                                Save Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
