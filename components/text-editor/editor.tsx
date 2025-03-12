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
import Heading, { Level } from "@tiptap/extension-heading";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bold, Italic, Strikethrough, Quote, Undo, Redo, Heading1, Heading2, Heading3, List, ListOrdered, Table as TableIcon, Image as ImageIcon, Columns, Plus, Minus } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

interface RichTextEditorProps {
  content: string;
  setContent: (content: string) => void;
}

type ActionType = "toggleBold" | "toggleItalic" | "toggleStrike" | "toggleBlockquote";

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

  if (!editor) {
    return <p>Loading editor...</p>
  }


  const actions: { action: ActionType; icon: React.ComponentType<{ className: string }>; label: string }[] = [
    { action: "toggleBold", icon: Bold, label: "Bold" },
    { action: "toggleItalic", icon: Italic, label: "Italic" },
    { action: "toggleStrike", icon: Strikethrough, label: "Strike" },
    { action: "toggleBlockquote", icon: Quote, label: "Quote" },
  ];

  return (
    <div className="flex flex-col bg-gray-100">

      <div className="flex flex-wrap items-center gap-2 bg-white shadow-md p-3 sticky top-0 z-50 border-b">
        {actions.map(({ action, icon: Icon, label }) => (
          <Button
            key={label}
            onClick={() => editor.chain().focus()[action as ActionType]().run()}
            variant="outline"
            className="p-2"
          >
            <Icon className="h-5 w-5" />
          </Button>
        ))}

        <Button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} variant="ghost">
          <Undo className="h-5 w-5" />
        </Button>
        <Button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} variant="ghost">
          <Redo className="h-5 w-5" />
        </Button>

        {[1, 2, 3].map((level) => (
          <Button
            key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as Level}).run()}
            variant="outline"
            className="p-2"
          >
            {level === 1 ? <Heading1 className="h-5 w-5" /> : level === 2 ? <Heading2 className="h-5 w-5" /> : <Heading3 className="h-5 w-5" />}
          </Button>
        ))}

        <Button onClick={() => editor.chain().focus().toggleBulletList().run()} variant="outline" className="p-2">
          <List className="h-5 w-5" />
        </Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} variant="outline" className="p-2">
          <ListOrdered className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-1" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
              <TableIcon className="h-5 w-5" /> Table
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
              <TableIcon className="h-4 w-4 mr-2" /> Insert Table
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()}>
              <Plus className="h-4 w-4 mr-2 text-blue-500" /> Add Row Above
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()}>
              <Plus className="h-4 w-4 mr-2 text-green-500" /> Add Row Below
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()}>
              <Minus className="h-4 w-4 mr-2 text-red-500" /> Remove Row
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()}>
              <Columns className="h-4 w-4 mr-2 text-blue-500" /> Add Column Before
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()}>
              <Columns className="h-4 w-4 mr-2 text-green-500" /> Add Column After
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()}>
              <Minus className="h-4 w-4 mr-2 text-red-500" /> Remove Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          onClick={() => {
            const url = prompt("Enter image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          variant="outline"
          className="p-2"
        >
          <ImageIcon className="h-5 w-5" />
        </Button>

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