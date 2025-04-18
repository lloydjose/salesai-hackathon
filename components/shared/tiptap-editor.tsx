'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility
import { Button } from '@/components/ui/button'; // For toolbar buttons
import { Bold, Italic, Strikethrough, Pilcrow, List, ListOrdered } from 'lucide-react';
import './tiptap-styles.css'; // We'll create this for basic styling

interface TipTapEditorProps {
    value: string;
    onChange: (richText: string) => void;
    placeholder?: string;
    className?: string;
    contentClassName?: string;
}

const TipTapToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input bg-transparent rounded-t-md p-1 flex flex-wrap gap-1">
            <Button
                type="button"
                variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
            >
                <Bold className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
            >
                <Italic className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('strike') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
            >
                <Strikethrough className="h-4 w-4" />
            </Button>
             <Button
                type="button"
                variant={editor.isActive('paragraph') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().setParagraph().run()}
                disabled={!editor.can().chain().focus().setParagraph().run()}
             >
                <Pilcrow className="h-4 w-4" />
            </Button>
            {/* Add more buttons as needed (headings, lists, etc.) */}
            <Button
                type="button"
                variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                disabled={!editor.can().chain().focus().toggleBulletList().run()}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                disabled={!editor.can().chain().focus().toggleOrderedList().run()}
            >
                <ListOrdered className="h-4 w-4" />
            </Button>
        </div>
    );
};


export function TipTapEditor({
    value,
    onChange,
    placeholder,
    className,
    contentClassName
}: TipTapEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Disable extensions if needed, e.g., codeBlock: false
                // heading: { levels: [1, 2, 3] } // Configure headings
            }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: cn(
                    'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl', // Basic prose styling
                    'min-h-[200px] w-full rounded-md rounded-t-none border border-input border-t-0 bg-background px-3 py-2 text-sm ring-offset-background',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    contentClassName
                ),
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className={cn("flex flex-col justify-stretch", className)}>
            <TipTapToolbar editor={editor} />
            <EditorContent editor={editor} placeholder={placeholder} />
        </div>
    );
}

// Create a corresponding CSS file: components/shared/tiptap-styles.css
/*
.tiptap {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem !important;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  // Add other basic styles as needed
  h1, h2, h3, h4, h5, h6 {
    line-height: 1.1;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.85rem;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    margin: 1.25rem 0;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    margin: 1.25rem 0;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 3px solid rgba(#0d0d0d, 0.1);
    margin: 1.25rem 0;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }
}

// Basic placeholder styling
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd; // Or use theme variable
  pointer-events: none;
  height: 0;
}
*/ 