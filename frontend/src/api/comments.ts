import apiClient from "./client";
import { type Comment } from "../types/post";

interface CreateCommentData {
  content: string;
  parent_comment_id?: number | null;
}

// 새 댓글을 생성하는 API 함수
export const createComment = async (
  postId: string,
  commentData: CreateCommentData
): Promise<Comment> => {
  try {
    const response = await apiClient.post(
      `/posts/${postId}/comments`,
      commentData
    );
    return response.data;
  } catch (error) {
    console.error("댓글 작성에 실패했습니다:", error);
    throw error;
  }
};
