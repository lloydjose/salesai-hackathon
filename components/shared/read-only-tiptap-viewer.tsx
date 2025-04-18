'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils'; 
import './tiptap-styles.css'; // Reuse the same styles

interface ReadOnlyTipTapViewerProps {
    value: string;
    className?: string;
    contentClassName?: string;
}

export function ReadOnlyTipTapViewer({
    value,
    className,
    contentClassName
}: ReadOnlyTipTapViewerProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Add configurations if needed, like typography
            }),
        ],
        content: value,
        editable: false, // Make the editor read-only
        editorProps: {
            attributes: {
                // Apply prose styling for better readability and basic styles from tiptap-styles.css
                class: cn(
                    'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl', 
                    'w-full px-3 py-2', // Basic padding
                    'focus-visible:outline-none', // No focus outline needed for read-only
                    contentClassName
                ),
            },
        },
    });

    if (!editor) {
        return null; // Or a loading indicator
    }

    return (
        <div className={cn("rounded-md border bg-background", className)}> {/* Added border and bg */} 
            <EditorContent editor={editor} />
        </div>
    );
} 