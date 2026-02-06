'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import NotebookLayout from '../../components/NotebookLayout';
import BlockEditor from '../../components/editor/BlockEditor';
import { Block, createBlock } from '../../components/editor/types';

// import { useAuth } from '../../../context/AuthContext'; // Removed

export default function NoteEditorPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const isNew = id === 'new';

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        if (!isNew) {
            fetchNote();
        } else {
            setBlocks([createBlock('text', '')]);
            setLoading(false);
        }
    }, [id]);

    const fetchNote = async () => {
        try {
            const res = await fetch(`${API_URL}/api/notes/${id}`);
            if (!res.ok) throw new Error('Note not found');
            const data = await res.json();

            setTitle(data.title);
            setCategory(data.category);

            // Handle legacy content (string) vs new content (blocks)
            if (Array.isArray(data.content)) {
                setBlocks(data.content);
            } else if (typeof data.content === 'string') {
                // Legacy: Convert simple string to one text block
                setBlocks([createBlock('text', data.content)]);
            } else {
                setBlocks([createBlock('text', '')]);
            }

            setLoading(false);
        } catch (error) {
            console.error(error);
            router.push('/notes');
        }
    };

    const handleSave = async () => {
        if (!title.trim()) return alert('Please add a title');
        setSaving(true);

        const noteData = {
            title,
            category,
            content: blocks // Send blocks array directly (Backend handles Mixed type)
        };

        try {
            const method = isNew ? 'POST' : 'PUT';
            const url = isNew ? `${API_URL}/api/notes` : `${API_URL}/api/notes/${id}`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)
            });

            if (!res.ok) throw new Error('Failed to save');

            router.push('/notes');
        } catch (error) {
            console.error('Error saving:', error);
            alert('Failed to save note');
            setSaving(false);
        }
    };

    if (loading) return null;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#222]">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 p-4 md:p-8">
            <div className="max-w-6xl mx-auto mb-6 flex justify-between items-center">
                <Link href="/notes">
                    <button className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors font-bold">
                        <ArrowLeft className="w-5 h-5" /> Back to Notes
                    </button>
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[var(--color-accent-yellow)] text-black px-6 py-2 rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform flex items-center gap-2 disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Note
                </button>
            </div>

            <NotebookLayout
                title={title}
                date={new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            >
                {/* Title Input (Integrated into Notebook Page) */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Note Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-transparent border-none text-4xl md:text-5xl font-handwriting font-bold placeholder-black/20 focus:outline-none focus:ring-0 px-0"
                    />
                    <div className="flex gap-2 mt-2">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2 self-start">Category:</span>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-transparent border-b border-gray-300 text-sm font-bold text-gray-600 focus:outline-none focus:border-black w-32"
                        />
                    </div>
                </div>

                {/* The Block Editor */}
                <BlockEditor
                    initialContent={blocks}
                    onChange={setBlocks}
                />

            </NotebookLayout>
        </div>
    );
}
