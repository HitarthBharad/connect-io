"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";
import Placeholder from "@tiptap/extension-placeholder"; 
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  setContent: (content: string) => void;
}

const RichTextEditor = ({ content, setContent }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      Image,
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Start typing here...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    }
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="flex flex-wrap gap-2 bg-white shadow-md p-3 sticky top-0 z-50 border-b">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn("px-3", editor.isActive("bold") && "bg-white-800 text-black")}
        >
          Bold
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn("px-3", editor.isActive("italic") && "bg-white-800 text-black")}
        >
          Italic
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={cn("px-3", editor.isActive("strike") && "bg-white-800 text-black")}
        >
          Strike
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn("px-3", editor.isActive("blockquote") && "bg-white-800 text-black")}
        >
          Quote
        </Button>
        <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>HR</Button>
        <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          Undo
        </Button>
        <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          Redo
        </Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
        <Button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet List</Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>Ordered List</Button>
        <Button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>Table</Button>
        <Button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          Image
        </Button>

        {
          editor.isActive("table") && (
            <div className="gap-4 p-4 bg-white shadow-md rounded-lg border border-gray-200 mt-4">
              <p className="text-lg font-semibold text-gray-800 mb-2">Table Formatting</p>

              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => editor.chain().focus().addRowBefore().run()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                  Add Row Above
                </Button>

                <Button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                  Add Row Below
                </Button>

                <Button
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                  Remove Row
                </Button>

                <Button
                  onClick={() => editor.chain().focus().addColumnBefore().run()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                >
                  Add Column Before
                </Button>

                <Button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none"
                >
                  Add Column After
                </Button>

                <Button
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                  Remove Column
                </Button>
              </div>
            </div>
          )
        }
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="prose max-w-none border p-4 min-h-full bg-white shadow-md rounded-lg">
          <EditorContent editor={editor} />
        </div>
      </div>
      <style>
        {`
  :focus {
    outline: none;
  }

  /* Heading Styles */
  h1 {
    font-size: 2rem;
    font-weight: bold;
    color: #1a202c; /* Dark gray */
    border-bottom: 2px solid #e2e8f0; /* Light gray */
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: bold;
    color: #2d3748; /* Slightly lighter gray */
    border-bottom: 1px solid #cbd5e0;
    padding-bottom: 0.3rem;
    margin-bottom: 0.8rem;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #4a5568; /* Even lighter gray */
    margin-bottom: 0.6rem;
  }

  /* Blockquote (Quote) */
  blockquote {
    font-style: italic;
    border-left: 4px solid #4a90e2; /* Blue border */
    padding-left: 1rem;
    margin: 1rem 0;
    color: #2d3748;
    background: #f7fafc;
    padding: 1rem;
    border-radius: 0.5rem;
  }

  /* Bullet List */
  ul {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.8rem 0;
  }

  ul li {
    margin-bottom: 0.3rem;
    font-size: 1rem;
    color: #2d3748;
  }

  /* Ordered List */
  ol {
    list-style-type: decimal;
    padding-left: 1.5rem;
    margin: 0.8rem 0;
  }

  ol li {
    margin-bottom: 0.3rem;
    font-size: 1rem;
    color: #2d3748;
  }

  /* Table Styles */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  th, td {
    border: 1px solid #e2e8f0;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: #edf2f7;
    font-weight: bold;
    color: #2d3748;
  }

  td {
    color: #4a5568;
  }

  tr:nth-child(even) {
    background-color: #f7fafc;
  }
  `}
      </style>
    </div>
  );
};

export default RichTextEditor;