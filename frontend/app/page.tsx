'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Clock, FileText, Star, Calendar as CalendarIcon } from 'lucide-react';
import Folder from './components/Folder';
import Calendar from './components/Calendar';
import Pomodoro from './components/Pomodoro';

// import { useAuth } from '../context/AuthContext'; // Removed
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [counts, setCounts] = useState({
    notes: 0,
    bookmarks: 0,
    personal: 0,
    work: 0,
    ideas: 0
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [notesRes, bookmarksRes] = await Promise.all([
        fetch(`${API_URL}/api/notes`),
        fetch(`${API_URL}/api/bookmarks`)
      ]);

      let notes = [];
      let bookmarks = [];

      if (notesRes.ok) {
        try { notes = await notesRes.json(); } catch (e) { console.error("Failed to parse notes", e); }
      } else {
        console.error("Notes fetch failed:", notesRes.status);
      }

      if (bookmarksRes.ok) {
        try { bookmarks = await bookmarksRes.json(); } catch (e) { console.error("Failed to parse bookmarks", e); }
      } else {
        console.warn("Bookmarks fetch failed:", bookmarksRes.status);
      }

      if (Array.isArray(notes)) {
        // Calculate category counts
        const personalCount = notes.filter((n: any) => n.category?.toLowerCase() === 'personal').length;
        const workCount = notes.filter((n: any) => n.category?.toLowerCase() === 'work').length;
        const ideasCount = notes.filter((n: any) => n.category?.toLowerCase() === 'ideas').length;

        setCounts({
          notes: notes.length,
          bookmarks: Array.isArray(bookmarks) ? bookmarks.length : 0,
          personal: personalCount,
          work: workCount,
          ideas: ideasCount
        });
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  return (
    <div className="min-h-full pb-20 px-6 md:px-12 w-full">
      {/* Header */}
      <header className="flex justify-between items-center py-6 mb-4 text-white">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide">PocketNote</h1>
        <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-white/20"></div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[180px]">

        {/* 1. Tall Welcome Card (Row Span 2) */}
        <div className="md:row-span-2 relative group">
          <div className="h-full retro-card bg-[#E4D4F4] p-6 text-black flex flex-col justify-between relative overflow-hidden transition-transform hover:-translate-y-1">
            {/* Decorative */}
            <div className="absolute top-4 right-4 rotate-12 bg-white px-3 py-1 rounded-full border-2 border-black font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {new Date().getFullYear()}
            </div>

            <div className="mt-8 z-10">
              <div className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Start Here</div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Capture<br />your ideas.
              </h2>
              <p className="font-medium text-black/70">
                Create a note, save a link, or organize your life.
              </p>
            </div>

            <div className="flex flex-col gap-3 z-10">
              <Link href="/notes?new=true" className="w-full">
                <button className="w-full bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                  <Plus className="w-4 h-4" /> Create Note
                </button>
              </Link>
            </div>

            {/* Background decorative blob */}
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/30 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* 2. Wide Calendar Card (Col Span 2) */}
        <div className="md:col-span-2 md:row-span-2 h-full">
          <Calendar />
        </div>

        {/* 3. Folder: Personal */}
        <div className="h-full">
          <Folder
            title="Personal"
            count={counts.personal}
            color="bg-[#FF6B6B]"
            href="/notes?category=Personal"
            subtitle="Diaries, Goals"
            className="h-full"
          />
        </div>

        {/* 4. Folder: Work */}
        <div className="h-full">
          <Folder
            title="Work"
            count={counts.work}
            color="bg-[#FFD93D]"
            href="/notes?category=Work"
            subtitle="Projects, Tasks"
            className="h-full"
          />
        </div>

        {/* 5. Folder: Ideas */}
        <div className="h-full">
          <Folder
            title="Ideas"
            count={counts.ideas}
            color="bg-[#6BCB77]"
            href="/notes?category=Ideas"
            subtitle="Brainstorming"
            className="h-full"
          />
        </div>

        {/* 6. Folder: Bookmarks */}
        <div className="h-full">
          <Folder
            title="Bookmarks"
            count={counts.bookmarks}
            color="bg-[#4D96FF]"
            href="/bookmarks"
            subtitle="Web Resources"
            className="h-full"
          />
        </div>

        {/* 7. Pomodoro Timer (Wide, Col Span 2) */}
        <div className="md:col-span-2 h-full">
          <Pomodoro />
        </div>

      </div>

      {/* FAB (Still useful for mobile or quick access) */}
      <Link href="/notes?new=true" className="fixed bottom-6 right-6 z-50 md:hidden">
        <button className="retro-button w-16 h-16 bg-white flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          <Plus className="w-8 h-8 stroke-[3]" />
        </button>
      </Link>
    </div>
  );
}
