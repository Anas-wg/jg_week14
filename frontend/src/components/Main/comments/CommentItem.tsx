import React from "react";
import { type Comment } from "../../../types/post";
import CommentForm from "./CommentForm";

// CommentList를 잠시 후에 만들 것이므로, 임시로 타입을 정의해줍니다.
// const CommentList = ({ comments, }: { comments: Comment[] }) => (
//   <div className="space-y-4">
//     {comments.map((comment) => (
//       <CommentItem key={comment.comment_id} comment={comment} />
//     ))}
//   </div>
// );
const CommentList = ({ comments, ...props }: any) => (
  <div className="space-y-4">
    {comments.map((comment: Comment) => (
      <CommentItem key={comment.comment_id} comment={comment} {...props} />
    ))}
  </div>
);

interface CommentItemProps {
  comment: Comment;
  activeReplyId: number | null;
  onSetReply: (id: number | null) => void;
  onCommentSubmit: (content: string, parentId: number) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  activeReplyId,
  onSetReply,
  onCommentSubmit,
}) => {
  const isReplying = activeReplyId === comment.comment_id;

  const handleReplySubmit = async (content: string) => {
    // 부모 댓글의 ID와 함께 제출
    await onCommentSubmit(content, comment.comment_id);
    onSetReply(null); // 제출 후 답글 폼 닫기
  };
  return (
    <div className="flex flex-col gap-2 py-4 border-t">
      {/* 댓글 내용 */}
      <div className="flex items-center gap-2">
        <span className="font-bold">{comment.author_nickname || "사용자"}</span>
        <span className="text-sm text-gray-500">
          {new Date(comment.created_at).toLocaleString()}
        </span>
      </div>
      <p className="text-gray-800">{comment.content}</p>

      {/* 답글 달기 버튼 */}
      {!isReplying && (
        <button
          onClick={() => onSetReply(comment.comment_id)}
          className="text-xs text-gray-500 self-start hover:underline"
        >
          답글 달기
        </button>
      )}

      {/* 답글 작성 폼 (isReplying이 true일 때만 보임) */}
      {isReplying && (
        <div className="ml-8 mt-2">
          <CommentForm
            onSubmit={handleReplySubmit}
            onCancel={() => onSetReply(null)}
            placeholder={`${comment.author?.nickname}님에게 답글 남기기`}
          />
        </div>
      )}

      {/* 대댓글 목록 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="pl-8 mt-4 border-l-2 border-gray-100">
          <CommentList
            comments={comment.replies}
            activeReplyId={activeReplyId}
            onSetReply={onSetReply}
            onCommentSubmit={onCommentSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
