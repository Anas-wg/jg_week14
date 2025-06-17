import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import TiptapEditor from "../components/common/TiptapEditor"; // Tiptap 에디터 불러오기
import { createPost } from "../api/posts";

const WritePage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  // Tiptap 에디터의 내용을 관리할 상태
  const [content, setContent] = useState("<p>여기에 내용을 입력하세요.</p>");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // HTML 태그를 제거한 순수 텍스트 내용으로 비어있는지 확인
    const textContent = content.replace(/<[^>]*>?/gm, "").trim();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!textContent) {
      alert("내용을 입력해주세요.");
      return;
    }

    try {
      const newPost = await createPost({ title, content });
      alert("게시글이 성공적으로 등록되었습니다.");
      navigate(`/posts/${newPost.post_id}`);
    } catch (error) {
      console.log(error);
      alert("게시글 등록에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "작성 중인 내용이 모두 삭제됩니다. 정말로 취소하시겠습니까?"
      )
    ) {
      navigate(-1);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <h1 className="text-3xl font-bold mb-8">글쓰기</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label=""
          type="text"
          placeholder="제목에 핵심 내용을 요약해 보세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold"
        />

        {/* Tiptap 에디터 컴포넌트로 교체 */}
        <TiptapEditor content={content} onContentChange={setContent} />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            등록
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WritePage;
