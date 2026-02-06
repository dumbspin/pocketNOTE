'use client';

import { ReactNode } from 'react';

interface NotebookLayoutProps {
    children: ReactNode;
    className?: string;
    leftPageContent?: ReactNode; // Optional content for left page (for double page view)
    title?: string;
    date?: string;
}

export default function NotebookLayout({ children, className = '', title, date }: NotebookLayoutProps) {
    return (
        <div className={`w-full max-w-6xl mx-auto ${className}`}>
            {/* Binder Container */}
            <div className="relative bg-[#333] p-2 md:p-4 rounded-[20px] shadow-2xl flex">

                {/* Binder Rings (Left) */}
                <div className="absolute left-0 top-0 bottom-0 w-12 md:w-16 z-20 flex flex-col justify-evenly py-8 pointer-events-none">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="relative w-full h-8">
                            {/* Ring */}
                            <div className="absolute left-2 md:left-4 w-12 md:w-16 h-8 border-t-4 border-b-4 border-gray-400 rounded-[50%] bg-gray-300 shadow-inner rotate-3"></div>
                            {/* Hole (Visual trick) */}
                            <div className="absolute left-[3.5rem] md:left-[4.5rem] top-2 w-4 h-4 bg-[#333] rounded-full shadow-inner"></div>
                        </div>
                    ))}
                </div>

                {/* Paper Pages */}
                <div className="flex-1 bg-[#FDF9F0] rounded-r-lg rounded-l-sm min-h-[80vh] shadow-inner relative overflow-hidden pl-12 md:pl-20 pr-4 md:pr-12 py-10 md:py-12">

                    {/* Visual Line Texture */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #9CA3AF 31px, #9CA3AF 32px)',
                            backgroundAttachment: 'local'
                        }}
                    ></div>
                    {/* Red Margin Line */}
                    <div className="absolute left-10 md:left-16 top-0 bottom-0 w-px bg-red-300/50 z-10"></div>

                    {/* Header Section */}
                    {(title || date) && (
                        <div className="mb-8 border-b-2 border-black/10 pb-4 relative z-10 flex justify-between items-end">
                            {title && <h1 className="text-3xl md:text-5xl font-handwriting font-bold text-black/80">{title}</h1>}
                            {date && <div className="font-mono text-xs md:text-sm text-gray-500 uppercase tracking-widest bg-black/5 px-2 py-1 rounded">{date}</div>}
                        </div>
                    )}

                    {/* Content Area */}
                    <div className="relative z-10 font-handwriting text-lg md:text-xl leading-[32px] text-gray-800">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
