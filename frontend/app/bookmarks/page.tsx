'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, X, Edit2, Trash2, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
// import { useAuth } from '../../context/AuthContext'; // Removed
import { useRouter } from 'next/navigation';

interface Bookmark {
    _id: string;
    title: string;
    url: string;
    description: string;
    category: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

const PASTEL_COLORS = [
    'bg-[#4D96FF]', // Blue
    'bg-[#6BCB77]', // Green
    'bg-[#FFD93D]', // Yellow
    'bg-[#FF8B66]', // Orange
    'bg-[#FF6B6B]', // Red/Pink
];

export default function BookmarksPage() {
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        description: '',
        category: 'General',
        tags: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            const response = await fetch(`${API_URL}/api/bookmarks`);
            const data = await response.json();
            setBookmarks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const bookmarkData = {
            ...formData,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };

        try {
            if (editingBookmark) {
                await fetch(`${API_URL}/api/bookmarks/${editingBookmark._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookmarkData)
                });
            } else {
                await fetch(`${API_URL}/api/bookmarks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookmarkData)
                });
            }
            setFormData({ title: '', url: '', description: '', category: 'General', tags: '' });
            setShowForm(false);
            setEditingBookmark(null);
            fetchBookmarks();
        } catch (error) {
            console.error('Error saving bookmark:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bookmark?')) return;

        try {
            await fetch(`${API_URL}/api/bookmarks/${id}`, {
                method: 'DELETE'
            });
            fetchBookmarks();
        } catch (error) {
            console.error('Error deleting bookmark:', error);
        }
    };

    const handleEdit = (bookmark: Bookmark) => {
        setEditingBookmark(bookmark);
        setFormData({
            title: bookmark.title,
            url: bookmark.url,
            description: bookmark.description,
            category: bookmark.category,
            tags: bookmark.tags.join(', ')
        });
        setShowForm(true);
    };

    const getRandomColor = (id: string) => {
        const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return PASTEL_COLORS[index % PASTEL_COLORS.length];
    };

    const filteredBookmarks = bookmarks.filter(bookmark =>
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (loading) return <div className="text-white text-center mt-20">Loading bookmarks...</div>;

    return (
        <div className="min-h-full pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <Link href="/">
                    <button className="p-2 bg-white rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all">
                        <ArrowLeft className="w-5 h-5 text-black" />
                    </button>
                </Link>
                <h1 className="text-3xl md:text-4xl text-white font-bold tracking-wide">Bookmarks</h1>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8">
                <input
                    type="text"
                    placeholder="Search bookmarks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#333] border-2 border-black rounded-full py-3 px-12 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-accent-blue)] transition-colors"
                />
                <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
            </div>

            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookmarks.map((bookmark) => (
                    <div key={bookmark._id} className={`retro-card ${getRandomColor(bookmark._id)} p-5 min-h-[160px] flex flex-col justify-between group`}>
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-xl leading-tight text-black flex-1 pr-2">{bookmark.title}</h3>
                                <a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="p-1 bg-white/50 rounded-full border border-black hover:bg-white transition-colors">
                                    <ExternalLink className="w-4 h-4 text-black" />
                                </a>
                            </div>
                            <p className="text-xs font-bold text-black/60 truncate mb-1">{bookmark.url}</p>
                            {bookmark.description && (
                                <p className="text-sm font-medium text-black/80 line-clamp-2">{bookmark.description}</p>
                            )}
                        </div>

                        <div className="flex justify-between items-end mt-4">
                            <div className="flex flex-wrap gap-1">
                                {bookmark.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="text-[10px] font-bold bg-black/10 px-1.5 py-0.5 rounded border border-black/10 text-black">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(bookmark)} className="p-1.5 bg-white border border-black rounded-full hover:scale-110 transition-transform">
                                    <Edit2 className="w-3 h-3 text-black" />
                                </button>
                                <button onClick={() => handleDelete(bookmark._id)} className="p-1.5 bg-white border border-black rounded-full hover:scale-110 transition-transform">
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookmarks.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    <p>{bookmarks.length === 0 ? "No bookmarks found. Save one!" : "No bookmarks match your search."}</p>
                </div>
            )}

            {/* FAB */}
            <button
                onClick={() => setShowForm(true)}
                className="fixed bottom-6 right-6 retro-button w-16 h-16 bg-[var(--color-accent-blue)] flex items-center justify-center text-black hover:scale-110 transition-transform z-10"
            >
                <Plus className="w-8 h-8 stroke-[3]" />
            </button>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#FDF9F0] w-[90%] md:w-full md:max-w-sm rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] p-6 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingBookmark(null);
                                setFormData({ title: '', url: '', description: '', category: 'General', tags: '' });
                            }}
                            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                        >
                            <X className="w-5 h-5 text-black" />
                        </button>

                        <h2 className="text-2xl font-bold mb-6 text-black">{editingBookmark ? 'Edit Bookmark' : 'New Bookmark'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-black font-bold focus:border-black focus:outline-none"
                                />
                            </div>
                            <div>
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    required
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-black focus:border-black focus:outline-none"
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Description (optional)"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-black focus:border-black focus:outline-none resize-none"
                                />
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-1/2 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-sm text-black focus:border-black focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Tags"
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    className="w-1/2 bg-white border-2 border-gray-200 rounded-xl px-4 py-2 text-sm text-black focus:border-black focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none transition-all mt-4"
                            >
                                {editingBookmark ? 'Save' : 'Add Bookmark'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
