import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost, updatePost } from "../api/posts";
import { type PostDetail } from "../types/post";
import { createComment } from "../api/comments";

import useAuthStore from "../stores/authStore";

import CommentList from "../components/Main/comments/CommentList";
import CommentForm from "../components/Main/comments/CommentForm";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const { isLoggedIn, user } = useAuthStore();
  const navigate = useNavigate();

  const handleEdit = async () => {
    if (!post) return;
    navigate(`/write?edit=true&postId=${post.post_id}`);
  };

  const handleDelete = async () => {
    if (!post || !window.confirm("정말로 이 게시글을 삭제하시겠습니까?"))
      return;

    try {
      await deletePost(post.post_id);
      alert("게시글이 성공적으로 삭제되었습니다.");
      navigate("/posts"); // navigate 수정
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      setLoading(true);
      const postData = await getPostById(postId);
      setPost(postData);
    } catch (error) {
      console.error("게시글을 불러오는 데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const handleCommentSubmit = async (
    content: string,
    parentId: number | null = null
  ) => {
    if (!postId) return;
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      return;
    }
    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }
    if (content.length > 500) {
      alert("댓글은 최대 500자까지 작성할 수 있습니다.");
      return;
    }
    if (
      parentId !== null &&
      !post?.comments.find((c) => c.comment_id === parentId)
    ) {
      alert("존재하지 않는 부모 댓글입니다.");
      return;
    }

    try {
      await createComment(postId, { content, parent_comment_id: parentId });
      alert("댓글이 성공적으로 등록되었습니다.");
      fetchPost(); // 댓글 목록 새로고침
      setReplyTo(null); // 답글 폼 닫기
    } catch (error) {
      console.log(error);
      alert("댓글 등록에 실패했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <main className="w-full max-w-4xl mx-auto my-12 px-4">
      <article>
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-black mb-4">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>작성자: {post.author.nickname}</span>
            <div className="flex items-center gap-4">
              <span>
                작성일: {new Date(post.created_at).toLocaleDateString()}
              </span>
              {isLoggedIn && user && post.author.id === user.userId && (
                <div className="flex gap-2">
                  <button
                    className="text-primary-blue font-bold"
                    onClick={handleEdit}
                  >
                    수정
                  </button>
                  <button className="font-bold" onClick={handleDelete}>
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div
          className="prose max-w-none py-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <hr className="my-8" />

      <section>
        <h2 className="text-xl font-bold mb-4">
          댓글 {post.comments.length}개
        </h2>

        {isLoggedIn ? (
          <CommentForm
            onSubmit={(content) => handleCommentSubmit(content, null)}
          />
        ) : (
          <div className="text-center p-4 border rounded-md bg-gray-50">
            <p>
              댓글을 작성하려면
              <a
                href="/signin"
                className="text-primary-blue font-bold underline"
              >
                로그인
              </a>
              이 필요합니다.
            </p>
          </div>
        )}

        <div className="mt-8">
          <CommentList
            comments={post.comments}
            activeReplyId={replyTo}
            onSetReply={setReplyTo}
            onCommentSubmit={handleCommentSubmit}
          />
        </div>
      </section>
    </main>
  );
};

export default PostDetailPage;
