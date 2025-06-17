import React, { useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { uploadImage } from "../../api/upload";

// 툴바 컴포넌트
const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { imageUrl } = await uploadImage(file);
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      console.log(error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  // 버튼 스타일을 위한 작은 헬퍼 함수
  const getButtonClass = (action: string, params?: object) => {
    const isActive = editor.isActive(action, params);
    return `p-1 rounded transition-colors ${
      isActive ? "bg-gray-300" : "hover:bg-gray-100"
    }`;
  };

  return (
    <div className="border border-b-0 border-gray-300 rounded-t-lg p-2 flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getButtonClass("bold")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinejoin="round"
            d="M6.75 3.744h-.753v8.25h7.125a4.125 4.125 0 0 0 0-8.25H6.75Zm0 0v.38m0 16.122h6.747a4.5 4.5 0 0 0 0-9.001h-7.5v9h.753Zm0 0v-.37m0-15.751h6a3.75 3.75 0 1 1 0 7.5h-6m0-7.5v7.5m0 0v8.25m0-8.25h6.375a4.125 4.125 0 0 1 0 8.25H6.75m.747-15.38h4.875a3.375 3.375 0 0 1 0 6.75H7.497v-6.75Zm0 7.5h5.25a3.75 3.75 0 0 1 0 7.5h-5.25v-7.5Z"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={getButtonClass("italic")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.248 20.246H9.05m0 0h3.696m-3.696 0 5.893-16.502m0 0h-3.697m3.697 0h3.803"
          />
        </svg>
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={getButtonClass("strike")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 12a8.912 8.912 0 0 1-.318-.079c-1.585-.424-2.904-1.247-3.76-2.236-.873-1.009-1.265-2.19-.968-3.301.59-2.2 3.663-3.29 6.863-2.432A8.186 8.186 0 0 1 16.5 5.21M6.42 17.81c.857.99 2.176 1.812 3.761 2.237 3.2.858 6.274-.23 6.863-2.431.233-.868.044-1.779-.465-2.617M3.75 12h16.5"
          />
        </svg>
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* 헤딩 버튼들 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={getButtonClass("heading", { level: 1 })}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getButtonClass("heading", { level: 2 })}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={getButtonClass("heading", { level: 3 })}
      >
        H3
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* 이미지 업로드 버튼 (기존) */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="p-1 rounded hover:bg-gray-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      {/* 실행 취소 / 다시 실행 버튼 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        className="p-1 rounded disabled:opacity-50"
      >
        Undo
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        className="p-1 rounded disabled:opacity-50"
      >
        Redo
      </button>
    </div>
  );
};

// Tiptap 에디터 본체 컴포넌트
interface TiptapEditorProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onContentChange,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder:
          "마크다운 문법을 지원합니다. 자유롭게 내용을 작성해보세요!",
      }),
      CharacterCount.configure({
        limit: 5000,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none p-4 min-h-[400px] border border-gray-300 rounded-b-lg focus:outline-none",
      },
    },
  });

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
      <div className="text-right text-sm text-gray-500 mt-1">
        {editor?.storage.characterCount.characters() || 0}/
        {editor?.storage.characterCount.limit} 자
      </div>
    </div>
  );
};

export default TiptapEditor;
