import React, { useRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
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
      // 이미지 업로드 API 호출
      const { imageUrl } = await uploadImage(file);
      // 성공 시 에디터에 이미지 추가
      editor.chain().focus().setImage({ src: imageUrl }).run();
    } catch (error) {
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div className="border border-gray-300 rounded-t-lg p-2 flex gap-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold") ? "bg-gray-300 p-1 rounded" : "p-1 rounded"
        }
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic") ? "bg-gray-300 p-1 rounded" : "p-1 rounded"
        }
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={
          editor.isActive("heading", { level: 1 })
            ? "bg-gray-300 p-1 rounded"
            : "p-1 rounded"
        }
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()} // 버튼 클릭 시 숨겨진 input 클릭
        className="p-1 rounded"
      >
        Image
      </button>
      {/* 눈에 보이지 않는 파일 입력 필드 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

// Tiptap 에디터 본체
interface TiptapEditorProps {
  content: string;
  onContentChange: (newContent: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  content,
  onContentChange,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none p-4 h-96 border border-gray-300 rounded-b-lg focus:outline-none",
      },
    },
  });

  return (
    <div>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
