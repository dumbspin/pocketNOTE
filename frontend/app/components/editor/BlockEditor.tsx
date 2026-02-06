'use client';

import { useState } from 'react';
import { Plus, Type, Image as ImageIcon, Video, PenTool, X, Trash2 } from 'lucide-react';
import { Block, BlockType, createBlock } from './types';
import DrawingCanvas from './DrawingCanvas';

interface BlockEditorProps {
    initialContent: Array<Block> | string;
    onChange: (blocks: Array<Block>) => void;
}

export default function BlockEditor({ initialContent, onChange }: BlockEditorProps) {
    // Parse initial content - if string, convert to single text block
    const [blocks, setBlocks] = useState<Block[]>(() => {
        if (typeof initialContent === 'string') {
            return initialContent ? [createBlock('text', initialContent)] : [];
        }
        return initialContent;
    });

    const updateBlocks = (newBlocks: Block[]) => {
        setBlocks(newBlocks);
        onChange(newBlocks);
    };

    const addBlock = (type: BlockType) => {
        const newBlock = createBlock(type);
        updateBlocks([...blocks, newBlock]);
    };

    const updateBlockContent = (id: string, content: string) => {
        const newBlocks = blocks.map(b => b.id === id ? { ...b, content } : b);
        updateBlocks(newBlocks);
    };

    const deleteBlock = (id: string) => {
        const newBlocks = blocks.filter(b => b.id !== id);
        updateBlocks(newBlocks);
    };

    return (
        <div className="space-y-6">
            {/* Blocks List */}
            <div className="space-y-6 min-h-[200px]">
                {blocks.map((block) => (
                    <div key={block.id} className="relative group">

                        {/* Delete Button (Hover) */}
                        <button
                            onClick={() => deleteBlock(block.id)}
                            className="absolute -right-8 top-0 p-1.5 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Block Content Renderers */}
                        {block.type === 'text' && (
                            <textarea
                                value={block.content}
                                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                                placeholder="Write something..."
                                className="w-full bg-transparent border-none focus:ring-0 p-0 text-xl font-handwriting leading-8 resize-none overflow-hidden"
                                rows={Math.max(2, block.content.split('\n').length)}
                                style={{ minHeight: '3rem' }}
                            // Auto-resize could go here
                            />
                        )}

                        {block.type === 'image' && (
                            <div className="relative">
                                {block.content ? (
                                    <div className="relative">
                                        <img src={block.content} alt="Media" className="max-w-full rounded-lg border-2 border-black/10 mx-auto" />
                                        <div className="absolute top-2 right-2">
                                            <button onClick={() => updateBlockContent(block.id, '')} className="bg-white p-1 rounded-full shadow-md"><X className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50/50">
                                        <input
                                            type="text"
                                            placeholder="Paste Image URL..."
                                            className="bg-transparent border-b border-gray-300 w-full max-w-sm focus:outline-none focus:border-black text-center mb-2"
                                            onBlur={(e) => updateBlockContent(block.id, e.target.value)}
                                        />
                                        <p className="text-xs text-gray-400">or paste a link directly</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {block.type === 'video' && (
                            <div className="relative">
                                {block.content ? (
                                    <div className="aspect-video w-full rounded-lg overflow-hidden border-2 border-black/10 bg-black">
                                        {/* Simple video embed detection or just display link if not specific */}
                                        {block.content.includes('youtube') || block.content.includes('youtu.be') ? (
                                            <iframe
                                                src={block.content.replace('watch?v=', 'embed/')}
                                                className="w-full h-full"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video src={block.content} controls className="w-full h-full" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50/50">
                                        <Video className="w-8 h-8 text-gray-300 mb-2" />
                                        <input
                                            type="text"
                                            placeholder="Paste Video URL (YouTube/MP4)..."
                                            className="bg-transparent border-b border-gray-300 w-full max-w-sm focus:outline-none focus:border-black text-center"
                                            onBlur={(e) => updateBlockContent(block.id, e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {block.type === 'drawing' && (
                            <DrawingCanvas
                                initialData={block.content}
                                onSave={(data) => updateBlockContent(block.id, data)}
                            />
                        )}

                    </div>
                ))}
            </div>

            {/* Toolbox (Floating or Bottom) */}
            <div className="flex gap-2 justify-center py-4 border-t-2 border-black/5 mt-8">
                <button onClick={() => addBlock('text')} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black rounded-lg hover:bg-gray-50 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[1px] active:shadow-none transition-all">
                    <Type className="w-4 h-4" /> Text
                </button>
                <button onClick={() => addBlock('image')} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black rounded-lg hover:bg-gray-50 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[1px] active:shadow-none transition-all">
                    <ImageIcon className="w-4 h-4" /> Image
                </button>
                <button onClick={() => addBlock('video')} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black rounded-lg hover:bg-gray-50 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[1px] active:shadow-none transition-all">
                    <Video className="w-4 h-4" /> Video
                </button>
                <button onClick={() => addBlock('drawing')} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-black rounded-lg hover:bg-gray-50 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-[1px] active:shadow-none transition-all">
                    <PenTool className="w-4 h-4" /> Draw
                </button>
            </div>

        </div>
    );
}
