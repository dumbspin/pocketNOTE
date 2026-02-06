'use client';

import { useState, useEffect, Suspense } from 'react';
import { Plus, Search, Trash2, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
// import { useAuth } from '../../context/AuthContext'; // Removed

interface Note {
    _id: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

const PASTEL_COLORS = [
    'bg-[#FFD93D]', // Yellow
    'bg-[#FF8B66]', // Orange
    'bg-[#6BCB77]', // Green
    'bg-[#4D96FF]', // Blue
    'bg-[#FF6B6B]', // Red/Pink
    'bg-[#FDF9F0]', // Cream
];

function NotesContent() {
    // State for deleting/editing locally
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const newParam = searchParams.get('new');

    useEffect(() => {
        fetchNotes();
        if (newParam === 'true') {
            router.replace('/notes/new');
        }
    }, []);

    useEffect(() => {
        // Just refresh if category changes?
        // fetchNotes() is enough initially
    }, [categoryParam]);

    const fetchNotes = async () => {
        try {
            const response = await fetch(`${API_URL}/api/notes`);
            const data = await response.json();

            if (response.ok && Array.isArray(data)) {
                setNotes(data);
            } else {
                console.error("Fetch notes failed or invalid format", data);
                setNotes([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching notes:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent link click
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await fetch(`${API_URL}/api/notes/${id}`, {
                method: 'DELETE'
            });
            fetchNotes();
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const getRandomColor = (id: string) => {
        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return PASTEL_COLORS[index % PASTEL_COLORS.length];
    };

    const filteredNotes = Array.isArray(notes) ? notes.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(searchQuery.toLowerCase());
        const categoryMatch = note.category.toLowerCase().includes(searchQuery.toLowerCase());

        // Handle content search (string or blocks)
        let contentMatch = false;
        if (typeof note.content === 'string') {
            contentMatch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (Array.isArray(note.content)) {
            // Search in text blocks
            // @ts-ignore
            contentMatch = note.content.some(block => block.content && typeof block.content === 'string' && block.content.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        const matchesSearch = titleMatch || categoryMatch || contentMatch;

        const matchesCategory = categoryParam
            ? note.category.toLowerCase() === categoryParam.toLowerCase()
            : true;

        return matchesSearch && matchesCategory;
    }) : [];

    if (loading) return <div className="text-white text-center mt-20">Loading notes...</div>;

    return (
        <div className="min-h-full pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <Link href="/">
                    <button className="p-2 bg-white rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all">
                        <ArrowLeft className="w-5 h-5 text-black" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-4xl text-white font-bold tracking-wide">
                        {categoryParam ? `${categoryParam} Notes` : 'All Notes'}
                    </h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#333] border-2 border-black rounded-full py-3 px-12 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-accent-yellow)] transition-colors"
                />
                <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            </div>

            {/* Category Filter Badge (Visual indicator) */}
            {categoryParam && (
                <div className="mb-4 flex items-center gap-2">
                    <span className="text-white/60 text-sm">Filtering by:</span>
                    <span className="bg-[var(--color-accent-yellow)] text-black font-bold px-3 py-1 rounded-full text-sm border border-black flex items-center gap-1">
                        {categoryParam}
                        <Link href="/notes">
                            <X className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" />
                        </Link>
                    </span>
                </div>
            )}

            {/* Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredNotes.map((note) => (
                    <Link href={`/notes/${note._id}`} key={note._id}>
                        <div className={`retro-card ${getRandomColor(note._id)} p-5 min-h-[180px] flex flex-col justify-between group cursor-pointer transition-transform hover:-translate-y-1`}>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl leading-tight text-black">{note.title}</h3>
                                    <span className="text-[10px] uppercase font-bold border border-black px-1.5 py-0.5 rounded-md bg-white/50 text-black">
                                        {note.category}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-black/80 line-clamp-4">
                                    {/* Preview logic: Handle string vs blocks */}
                                    {typeof note.content === 'string'
                                        ? note.content
                                        : (Array.isArray(note.content)
                                            // @ts-ignore
                                            ? (note.content.find(b => b.type === 'text')?.content || '[Rich Media Content]')
                                            : '')}
                                </p>
                            </div>

                            <div className="flex justify-between items-end mt-4">
                                <div className="flex gap-1 text-[10px] font-bold text-black/60">
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => handleDelete(e, note._id)} className="p-1.5 bg-white border border-black rounded-full hover:scale-110 transition-transform hover:bg-red-50">
                                        <Trash2 className="w-3 h-3 text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredNotes.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    <p>{notes.length === 0 ? "No notes found. Create one!" : "No notes match your filter."}</p>
                </div>
            )}

            {/* FAB */}
            <Link href="/notes/new">
                <button
                    className="fixed bottom-6 right-6 retro-button w-16 h-16 bg-[var(--color-accent-yellow)] flex items-center justify-center text-black hover:scale-110 transition-transform z-10"
                >
                    <Plus className="w-8 h-8 stroke-[3]" />
                </button>
            </Link>
        </div>
    );
}

export default function NotesPage() {
    return (
        <Suspense fallback={<div className="text-white">Loading...</div>}>
            <NotesContent />
        </Suspense>
    );
}
