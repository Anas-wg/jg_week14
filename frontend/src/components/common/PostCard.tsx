import React from "react";
import { Link } from "react-router-dom";
import { type Post } from "../../types/post";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // 날짜 형식을 'YYYY.MM.DD'로 간단하게 변경하는 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 1. content(HTML 문자열)에서 첫 번째 이미지 URL을 추출하는 함수
  const extractFirstImageUrl = (htmlContent: string): string | null => {
    if (!htmlContent) return null;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;

    // div 안에서 첫 번째 img 태그를 찾습니다.
    const firstImage = tempDiv.querySelector("img");

    // img 태그가 있다면 src 속성을, 없다면 null을 반환합니다.
    return firstImage ? firstImage.getAttribute("src") : null;
  };

  // 2. 위 함수를 호출하여 썸네일로 사용할 URL을 얻습니다.
  const thumbnailUrl = extractFirstImageUrl(post.content);

  return (
    <Link
      to={`/posts/${post.post_id}`}
      className="block rounded-lg p-4 transition-shadow hover:shadow-md"
    >
      <article className="flex items-center gap-6">
        {/* 왼쪽 텍스트 영역 */}
        <div className="flex-1">
          <h3 className="mb-2 text-lg font-bold text-black">{post.title}</h3>
          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {post.content.replace(/<[^>]*>?/gm, "")}
          </p>
          <div className="flex items-center text-xs text-gray-400">
            <span>{formatDate(post.created_at)}</span>
            <span className="mx-2">·</span>
            {/* post.author가 없을 경우를 대비하여 optional chaining(?.) 추가 */}
            <span>{post.author?.nickname}</span>
          </div>
        </div>

        {/* 3. 오른쪽 이미지 영역: thumbnailUrl이 있을 때만 렌더링 */}
        {thumbnailUrl && (
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={thumbnailUrl}
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
