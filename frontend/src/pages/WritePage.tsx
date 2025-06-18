import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import InputField from "../components/common/InputField";
import Button from "../components/common/Button";
import TiptapEditor from "../components/common/TiptapEditor";
import { createPost, getPostById, updatePost } from "../api/posts";
import useAuthStore from "../stores/authStore";

const WritePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = searchParams.get("edit") === "true";
  const postId = searchParams.get("postId");
  const { isLoggedIn, user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("<p>여기에 내용을 입력하세요.</p>");
  const [loading, setLoading] = useState(false);
  const [originalAuthorId, setOriginalAuthorId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
      return;
    }

    const fetchPost = async () => {
      if (isEditing && postId) {
        try {
          setLoading(true);
          const post = await getPostById(postId);

          // Check if the current user is the author
          if (post.author.id !== user?.userId) {
            alert("게시글 수정 권한이 없습니다.");
            navigate(-1);
            return;
          }

          setTitle(post.title);
          setContent(post.content);
          setOriginalAuthorId(post.author.id);
        } catch (error) {
          console.error("게시글을 불러오는데 실패했습니다:", error);
          alert("게시글을 불러오는데 실패했습니다.");
          navigate(-1);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [isEditing, postId, navigate, isLoggedIn, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      alert("로그인이 필요합니다.");
      navigate("/signin");
      return;
    }

    const textContent = content.replace(/<[^>]*>?/gm, "").trim();

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!textContent) {
      alert("내용을 입력해주세요.");
      return;
    }

    if (title.length > 100) {
      alert("제목은 100자를 초과할 수 없습니다.");
      return;
    }

    try {
      if (isEditing && postId) {
        // Double check author permissions
        if (originalAuthorId !== user?.userId) {
          alert("게시글 수정 권한이 없습니다.");
          return;
        }

        await updatePost(parseInt(postId), { title, content });
        alert("게시글이 성공적으로 수정되었습니다.");
        navigate(`/posts/${postId}`);
      } else {
        const newPost = await createPost({ title, content });
        alert("게시글이 성공적으로 등록되었습니다.");
        navigate(`/posts/${newPost.post_id}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(
        error?.message ||
          (isEditing
            ? "게시글 수정에 실패했습니다."
            : "게시글 등록에 실패했습니다.")
      );
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

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 px-4">로딩 중...</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-4">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? "글 수정하기" : "글쓰기"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label=""
          type="text"
          placeholder="제목에 핵심 내용을 요약해 보세요."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold"
          maxLength={100}
        />

        <TiptapEditor content={content} onContentChange={setContent} />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="secondary" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? "수정" : "등록"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default WritePage;
