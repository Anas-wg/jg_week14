import React, { useState } from "react";
import Button from "../../common/Button";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void; // 취소 함수
  placeholder?: string; // 플레이스홀더
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  onCancel,
  // placeholder = "바른말 고운말",
}) => {
  const [content, setContent] = useState("");

  const handleCancel = () => {
    setContent("");
    onCancel?.(); // onCancel prop이 있으면 실행
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    await onSubmit(content);
    setContent(""); // 제출 후 입력창 비우기
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        rows={3}
      />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCancel}
        >
          취소
        </Button>
        <Button type="submit" variant="primary" size="sm">
          등록
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
