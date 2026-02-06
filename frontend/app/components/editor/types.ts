export type BlockType = 'text' | 'image' | 'video' | 'drawing' | 'link';

export interface Block {
    id: string;
    type: BlockType;
    content: string; // Text content, or URL, or base64
    meta?: any; // Extra data like caption, drawings paths, etc.
}

export const createBlock = (type: BlockType = 'text', content: string = ''): Block => ({
    id: crypto.randomUUID(),
    type,
    content
});
