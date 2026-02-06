import Link from 'next/link';
import { MoreHorizontal } from 'lucide-react';

interface FolderProps {
    title: string;
    count: number;
    color: string; // Tailwind bg class expected, e.g., 'bg-yellow-400'
    href: string;
    subtitle?: string;
    className?: string; // Allow custom classes for positioning/sizing
}

export default function Folder({ title, count, color, href, subtitle, className = '' }: FolderProps) {
    return (
        <Link href={href} className={`block group h-full ${className}`}>
            <div className="relative w-full h-full min-h-[160px] transition-transform duration-300 hover:-translate-y-2">

                {/* Back Paper Layer (The "files" inside) */}
                <div className="absolute top-0 right-2 w-[90%] h-full bg-white rounded-t-2xl rounded-br-2xl border-2 border-black/10 origin-bottom-left transform group-hover:rotate-6 transition-transform z-0"></div>
                <div className="absolute top-2 right-4 w-[85%] h-full bg-[#f0f0f0] rounded-t-2xl rounded-br-2xl border-2 border-black/10 origin-bottom-left transform group-hover:rotate-3 transition-transform z-10"></div>

                {/* The Folder Front */}
                <div className={`absolute bottom-0 w-full h-[85%] ${color} rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-20 flex flex-col justify-between p-4`}>

                    {/* Folder Tab (Visual approximation) */}
                    <div className={`absolute -top-3 left-0 w-1/3 h-4 ${color} rounded-t-lg border-t-2 border-l-2 border-r-2 border-black z-20`}></div>
                    {/* Cover line to hide bottom border of tab */}
                    <div className={`absolute -top-0.5 left-0.5 w-[calc(33.33%-4px)] h-1 ${color} z-30`}></div>

                    {/* Content */}
                    <div className="flex justify-between items-start mt-2">
                        <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg border border-black/10 shadow-sm">
                            <span className="text-xs font-bold text-black">{count} items</span>
                        </div>
                        <MoreHorizontal className="w-5 h-5 text-black/40" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-black tracking-tight">{title}</h3>
                        {subtitle && <p className="text-xs font-medium text-black/60 mt-0.5">{subtitle}</p>}
                    </div>
                </div>
            </div>
        </Link>
    );
}
