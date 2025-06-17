import React from "react";
import { type Comment } from "../../../types/post";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: Comment[];
  activeReplyId: number | null;
  onSetReply: (id: number | null) => void;
  onCommentSubmit: (content: string, parentId: number | null) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({ comments, ...props }) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.comment_id} comment={comment} {...props} />
      ))}
    </div>
  );
};

export default CommentList;
