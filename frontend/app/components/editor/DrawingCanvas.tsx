'use client';

import { useRef, useEffect, useState } from 'react';
import { Eraser, RotateCcw, PenTool } from 'lucide-react';

interface DrawingCanvasProps {
    initialData?: string;
    onSave: (data: string) => void;
    readOnly?: boolean;
}

export default function DrawingCanvas({ initialData, onSave, readOnly = false }: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (context) {
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.lineWidth = 3;
            context.strokeStyle = '#000000';
            setCtx(context);

            if (initialData) {
                const img = new Image();
                img.src = initialData;
                img.onload = () => {
                    context.drawImage(img, 0, 0);
                };
            }
        }
    }, []);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (readOnly || !ctx || !canvasRef.current) return;

        const { offsetX, offsetY } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || readOnly || !ctx || !canvasRef.current) return;

        const { offsetX, offsetY } = getCoordinates(e);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing || readOnly || !ctx || !canvasRef.current) return;

        ctx.closePath();
        setIsDrawing(false);
        onSave(canvasRef.current.toDataURL());
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { offsetX: 0, offsetY: 0 };

        if ('touches' in e) {
            const rect = canvas.getBoundingClientRect();
            return {
                offsetX: e.touches[0].clientX - rect.left,
                offsetY: e.touches[0].clientY - rect.top
            };
        } else {
            return {
                // @ts-ignore
                offsetX: e.nativeEvent.offsetX,
                // @ts-ignore
                offsetY: e.nativeEvent.offsetY
            };
        }
    };

    const clearCanvas = () => {
        if (readOnly || !ctx || !canvasRef.current) return;
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        onSave('');
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-2 bg-white relative group">
            <canvas
                ref={canvasRef}
                width={600}
                height={300}
                className={`w-full h-auto touch-none ${readOnly ? '' : 'cursor-crosshair'}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            {!readOnly && (
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={clearCanvas} className="p-1.5 bg-white border border-black rounded-full shadow-sm hover:scale-110">
                        <RotateCcw className="w-4 h-4 text-black" />
                    </button>
                </div>
            )}
        </div>
    );
}
