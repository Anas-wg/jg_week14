import React from "react";
import { Link } from "react-router-dom";
import { type Post } from "../../types/post"; // 1단계에서 만든 타입 불러오기

// PostCard가 받을 props 타입을 정의합니다.
interface PostCardProps {
  post: Post;
}

// post id
const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <Link
      to={`/posts/${post.post_id}`}
      className="block rounded-lg p-4 transition-shadow hover:shadow-md"
    >
      <article className="flex items-center gap-6">
        {/* 2. 왼쪽 텍스트 영역 */}
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold text-black">{post.title}</h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {post.content.replace(/<[^>]*>?/gm, "")}
          </p>
          <div className="flex items-center text-xs text-gray-400">
            <span>{formatDate(post.created_at)}</span>
            <span className="mx-2">·</span>
            <span>{post.author.nickname}</span>
          </div>
        </div>

        {/* 3. 오른쪽 이미지 영역 */}
        {post.imageUrl && (
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={post.imageUrl}
              alt={`${post.title} 썸네일`}
              className="h-full w-full rounded-md object-cover"
            />
          </div>
        )}
      </article>
    </Link>
  );
};

export default PostCard;
